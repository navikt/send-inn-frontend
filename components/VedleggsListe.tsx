import React, { FC, ReactElement, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { VedleggType, SoknadType } from '../types/types';
import Vedlegg from '../components/Vedlegg';
import SkjemaNedlasting from '../components/SkjemaNedlasting';
import Kvittering, { KvitteringsDto } from '../components/Kvittering';
import { VedleggProps } from '../components/Vedlegg';
import { Button, Alert } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { Modal, Heading, Ingress, BodyLong } from '@navikt/ds-react';
import { FellesModal } from './FellesModal';
import { useTranslation } from 'react-i18next';
import { Add } from '@navikt/ds-icons';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import {
    formatertDato,
    seksUkerFraDato,
} from '../components/Kvittering';
import getConfig from 'next/config';
import { OpprettAnnetVedlegg } from './OpprettAnnetVedlegg';
import styled from 'styled-components';
import { SideValideringProvider } from './SideValideringProvider';

const { publicRuntimeConfig } = getConfig();

const initialVedleggsliste: VedleggType[] | [] = [];

const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
`;

const PaddedVedlegg = styled.div`
    > * {
        margin-top: 16px;
    }
`;

const ButtonContainer = styled.div`
    margin-right: auto;
    margin-top: 60px;
    width: fit-content;
    min-width: 207px;
    button {
        margin-bottom: 24px;
    }
    display: flex;

    flex-direction: column;

    @media only screen and (max-width: 600px) {
        width: 100%;
    }
`;

const Linje = styled.div`
    border-bottom: 1px solid var(--navds-semantic-color-border);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

const FristForOpplastingInfo = styled(Alert)`
    border: 0;
    border-bottom: 1px solid var(--navds-semantic-color-border);
    padding-bottom: 4px;
    border-radius: 0px;
    margin-bottom: 24px;
    text-transform: uppercase;
`;

export interface VedleggsListeProps {
    soknad: SoknadType;
    setSoknad: React.Dispatch<
        React.SetStateAction<SoknadType | null>
    >;
    vedleggsliste: VedleggType[] | [];
    setVedleggsListe: React.Dispatch<
        React.SetStateAction<VedleggType[] | []>
    >;
    erEttersending: boolean;
    visningsSteg?: number;
    visningsType?: string;
}
/*
let example: KvitteringsDto = {
    innsendingsId: '18c02791-82ac-42e6-ae15-419dd27459b2',
    label: 'Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)',
    mottattdato: '2022-05-24T12:00:24.8398842Z',
    <hoveddokumentRef:></hoveddokumentRef:>
        'soknad/18c02791-82ac-42e6-ae15-419dd27459b2/vedlegg/1/fil/2',
    innsendteVedlegg: [
        {
            vedleggsnr: 'C1',
            tittel: 'Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ',
        },
        {
            vedleggsnr: 'W1',
            tittel: 'Dokumentasjon på mottatt bidrag',
        },
    ],
    skalEttersendes: [
        {
            vedleggsnr: 'C1',
            tittel: 'Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ',
        },
        {
            vedleggsnr: 'W1',
            tittel: 'Dokumentasjon på mottatt bidrag',
        },
    ],
    ettersendingsfrist: '2022-07-05T12:00:24.8398842Z',
};
*/
function soknadErKomplett(
    vedleggsliste: VedleggType[],
    erEttersending: boolean,
): boolean {
    const detFinnesEtUopplastetPakrevdVedlegg = vedleggsliste.some(
        (element) => {
            return (
                element.erPakrevd === true &&
                element.opplastingsStatus !== 'LastetOpp'
            );
        },
    );

    return !detFinnesEtUopplastetPakrevdVedlegg;
}

function soknadKanSendesInn(
    vedleggsliste: VedleggType[],
    erEttersending: boolean,
): boolean {
    const noeErLastetOpp = vedleggsliste.some((element) => {
        return element.opplastingsStatus === 'LastetOpp';
    });
    const detFinnesEtUpploastetHovedDokument = vedleggsliste.some(
        (element) => {
            return (
                element.erHoveddokument === true &&
                element.opplastingsStatus !== 'LastetOpp'
            );
        },
    );
    return noeErLastetOpp && !detFinnesEtUpploastetHovedDokument;
}

function getHovedSkjema(vedleggsliste: VedleggType[]) {
    vedleggsliste.forEach((element) => {
        // om det er ettersending kan vi ignorere hoveddokumentet/skjema, alle andre dokumenter må fortsatt ha minst et dokument lastet opp

        if (element.erHoveddokument) {
            return element;
        }
    });
    return null;
}

function VedleggsListe({
    soknad,
    setSoknad,
    vedleggsliste,
    setVedleggsListe,
    erEttersending,
}: VedleggsListeProps) {
    const { showError } = useErrorMessage();

    const [soknadKlar, setSoknadErKomplett] =
        useState<boolean>(false);
    const [soknadHarNoeInnlevert, setSoknadKanSendesInn] =
        useState<boolean>(false);
    const router = useRouter();
    const [visningsSteg, setVisningsSteg] = useState(
        soknad.visningsSteg,
    );

    const [fortsettSenereSoknadModal, setForstettSenereSoknadModal] =
        useState(false);
    const [slettSoknadModal, setSlettSoknadModal] = useState(false);
    const [sendInnUferdigSoknadModal, setSendInnUferdigSoknadModal] =
        useState(false);
    const [
        sendInnKomplettSoknadModal,
        setSendInnKomplettSoknadModal,
    ] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const [isLoading, setisLoading] = useState(false);

    const [visKvittering, setVisKvittering] = useState(false);
    const [soknadsInnsendingsRespons, setSoknadsInnsendingsRespons] =
        useState(null);

    const [visningsType, setVisningsType] = useState(
        soknad.visningsType,
    );

    const [lastOppVedleggHarFeil, setLastOppVedleggHarFeil] =
        useState(false);
    const [visLastOppVedleggFeil, setVisLastOppVedleggFeil] =
        useState(false);
    const [
        lastOppVedleggValideringfokus,
        setLastOppVedleggValideringfokus,
    ] = useState(false);

    const [side1HarFeil, setSide1HarFeil] = useState(false);
    const [visSide1Feil, setVisSide1Feil] = useState(false);
    const [side1Valideringfokus, setSide1Valideringfokus] =
        useState(false);

    const visSteg0 =
        !visKvittering &&
        visningsType === 'dokumentinnsending' &&
        visningsSteg === 0;

    const visSteg1 =
        !visKvittering &&
        visningsType === 'dokumentinnsending' &&
        visningsSteg === 1;

    const visLastOppVedlegg =
        !visKvittering &&
        (visningsType !== 'dokumentinnsending' ||
            (visningsType === 'dokumentinnsending' &&
                visningsSteg === 2));

    const oppdaterVisningsSteg = (nr: number) => {
        const nyttVisningsSteg = visningsSteg + nr;
        setVisningsSteg(nyttVisningsSteg);

        axios
            .patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/`,
                {
                    visningsSteg: nyttVisningsSteg,
                },
            )
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                showError(error);
            });
    };

    const oppdaterVisningsType = (event) => {
        setVisningsType(event.target.value);
    };

    function setOpplastingStatus(id: number, status: string): void {
        axios
            .patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${id}`,
                {
                    opplastingsStatus: status,
                },
            )
            .then((response) => {
                console.log(response);
                const newListe = vedleggsliste.map((el) =>
                    el.id === id ? { ...response.data } : el,
                );
                setVedleggsListe(newListe);
            })
            .catch((error) => {
                showError(error);
            });
    }

    const oppdaterLokalOpplastingStatus = (
        id: number,
        opplastingsStatus: string,
    ) => {
        const newListe = vedleggsliste.map((el) =>
            el.id === id ? { ...el, opplastingsStatus } : el,
        );
        setVedleggsListe(newListe);
    };

    const leggTilVedlegg = (vedlegg) => {
        setVedleggsListe([...vedleggsliste, vedlegg]);
    };
    const slettAnnetVedlegg = (vedleggsId) => {
        axios
            .delete(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${vedleggsId}`,
            )
            .then(() => {
                console.log({ vedleggsliste });
                const newListe = vedleggsliste.filter(
                    (el) => el.id !== vedleggsId,
                );
                setVedleggsListe(newListe);
            })
            .catch((error) => {
                showError(error);
            });
    };

    const tilMinSide = () => {
        console.log('TilMinSide');
        window.location.assign(process.env.NEXT_PUBLIC_MIN_SIDE_URL);
    };

    const onSendInn = () => {
        setisLoading(true);
        axios
            .post(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .then((response) => {
                const kv: KvitteringsDto = response.data;
                setSoknadsInnsendingsRespons(kv);
                setSendInnUferdigSoknadModal(false);
                setSendInnKomplettSoknadModal(false);
                setVisKvittering(true);
            })
            .finally(() => {
                setisLoading(false);
            })
            .catch((error) => {
                showError(error);
            });
    };

    const slett = () => {
        setisLoading(true);
        axios
            .delete(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad?.innsendingsId}`,
            )
            .then(() => {
                resetState();
                tilMinSide();
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {
                setisLoading(false);
            });
    };

    useEffect(() => {
        setSoknadErKomplett(
            soknadErKomplett(vedleggsliste, erEttersending),
        );
        setSoknadKanSendesInn(
            soknadKanSendesInn(vedleggsliste, erEttersending),
        );
    }, [vedleggsliste, erEttersending]);

    useEffect(() => {
        const changeLang = (lng) => {
            // nb / nn / en / se / pl støttede språk per 2022 for dekoratoren

            if (lng === 'no') {
                i18n.changeLanguage('nb');
                setParams({
                    language: 'nb',
                });
                return;
            }
            if (lng === 'nn') {
                i18n.changeLanguage('nn');
                setParams({
                    language: 'nn',
                });
                return;
            }
            if (lng === 'en') {
                i18n.changeLanguage('en');
                setParams({
                    language: 'en',
                });
                return;
            }

            if (lng === 'se') {
                i18n.changeLanguage('se');
                setParams({
                    language: 'se',
                });
                return;
            }

            if (lng === 'pl') {
                i18n.changeLanguage('pl');
                setParams({
                    language: 'pl',
                });
                return;
            }

            i18n.changeLanguage('en');
            setParams({
                language: 'en',
            });
        };

        changeLang(soknad.spraak);
        document.documentElement.lang = i18n.language;
    }, [soknad, i18n]);

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };
    return (
        <Style>
            {/* TODO trenger vi dette allikevel? kanskje for å jobbe med  */}
            {/* { 
                språktest: {t('test')} <br />
                språk: <br />             soknad.spraak // skriver ut språk
                <br />
            
            */}
            {visKvittering && (
                <div>
                    {' '}
                    <Kvittering
                        kvprops={soknadsInnsendingsRespons}
                    />{' '}
                </div>
            )}
            {visSteg0 && (
                <div>
                    {soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <>
                                <Heading size="large" spacing>
                                    {t(
                                        'soknad.visningsSteg.steg0.tittel',
                                    )}
                                </Heading>
                                <Linje />
                                <SkjemaNedlasting
                                    innsendingsId={
                                        soknad.innsendingsId
                                    }
                                    setOpplastingStatus={
                                        setOpplastingStatus
                                    }
                                    vedlegg={
                                        vedleggsliste.filter(
                                            (x) => x.erHoveddokument,
                                        )[0]
                                    }
                                />
                            </>
                        )}
                </div>
            )}
            {visSteg1 && (
                <div>
                    {soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <>
                                <Heading size="large" spacing>
                                    {t(
                                        'soknad.visningsSteg.steg1.tittel',
                                    )}
                                </Heading>
                                <Linje />
                                <SideValideringProvider
                                    setHarValideringsfeil={
                                        setSide1HarFeil
                                    }
                                    visValideringsfeil={visSide1Feil}
                                    setVisValideringsfeil={
                                        setVisSide1Feil
                                    }
                                    fokus={side1Valideringfokus}
                                    setFokus={setSide1Valideringfokus}
                                >
                                    <PaddedVedlegg>
                                        <Vedlegg
                                            innsendingsId={
                                                soknad.innsendingsId
                                            }
                                            setOpplastingStatus={
                                                setOpplastingStatus
                                            }
                                            oppdaterLokalOpplastingStatus={
                                                oppdaterLokalOpplastingStatus
                                            }
                                            vedlegg={
                                                vedleggsliste.filter(
                                                    (x) =>
                                                        x.erHoveddokument,
                                                )[0]
                                            }
                                            slettAnnetVedlegg={
                                                slettAnnetVedlegg
                                            }
                                        />
                                    </PaddedVedlegg>
                                </SideValideringProvider>
                            </>
                        )}
                </div>
            )}
            {visLastOppVedlegg && (
                <div>
                    {/* soknad.spraak skriver ut språk */}
                    {/* {soknadKlar.toString() + " // "} */}
                    {/* {soknadHarNoeInnlevert.toString() + " // "} */}
                    {/* {JSON.stringify(vedleggsliste)} */}

                    <Heading size="large" spacing>
                        {t(
                            'soknad.visningsSteg.lastOppVedlegg.tittel',
                        )}
                    </Heading>
                    <Ingress spacing>
                        {t(
                            'soknad.visningsSteg.lastOppVedlegg.ingress',
                        )}
                    </Ingress>
                    <FristForOpplastingInfo
                        variant="info"
                        inline={true}
                        size="small"
                    >
                        {t(
                            'soknad.visningsSteg.lastOppVedlegg.infoFrist',
                            {
                                dato: formatertDato(
                                    seksUkerFraDato(
                                        new Date(
                                            soknad.opprettetDato,
                                        ),
                                    ),
                                ),
                            },
                        )}
                    </FristForOpplastingInfo>

                    <SideValideringProvider
                        setHarValideringsfeil={
                            setLastOppVedleggHarFeil
                        }
                        visValideringsfeil={visLastOppVedleggFeil}
                        setVisValideringsfeil={
                            setVisLastOppVedleggFeil
                        }
                        fokus={lastOppVedleggValideringfokus}
                        setFokus={setLastOppVedleggValideringfokus}
                    >
                        {visningsType === 'dokumentinnsending' &&
                            visningsType === 'dokumentinnsending' &&
                            vedleggsliste.some((element) => {
                                return (
                                    element.erHoveddokument ===
                                        true &&
                                    element.opplastingsStatus !==
                                        'LastetOpp'
                                );
                            }) && (
                                <Alert
                                    variant="warning"
                                    size="medium"
                                >
                                    {t(
                                        'soknad.visningsSteg.lastOppVedlegg.advarselHovedskjema',
                                    )}
                                </Alert>
                            )}

                        <PaddedVedlegg>
                            {soknad &&
                                vedleggsliste.length > 0 &&
                                vedleggsliste
                                    .filter((x) => !x.erHoveddokument)
                                    .map((vedlegg) => {
                                        return (
                                            <Vedlegg
                                                key={vedlegg.id}
                                                innsendingsId={
                                                    soknad.innsendingsId
                                                }
                                                setOpplastingStatus={
                                                    setOpplastingStatus
                                                }
                                                oppdaterLokalOpplastingStatus={
                                                    oppdaterLokalOpplastingStatus
                                                }
                                                vedlegg={vedlegg}
                                                slettAnnetVedlegg={
                                                    slettAnnetVedlegg
                                                }
                                            />
                                        );
                                    })}

                            {soknad.kanLasteOppAnnet && (
                                <OpprettAnnetVedlegg
                                    innsendingsId={
                                        soknad.innsendingsId
                                    }
                                    leggTilVedlegg={leggTilVedlegg}
                                />
                            )}
                        </PaddedVedlegg>
                    </SideValideringProvider>
                </div>
            )}
            {!visKvittering && (
                <ButtonContainer>
                    {visLastOppVedlegg && (
                        <>
                            {soknadKlar && (
                                <Button
                                    onClick={() => {
                                        if (lastOppVedleggHarFeil) {
                                            setLastOppVedleggValideringfokus(
                                                true,
                                            );
                                            setVisLastOppVedleggFeil(
                                                true,
                                            );
                                            return;
                                        }
                                        if (
                                            !sendInnKomplettSoknadModal
                                        ) {
                                            setSendInnKomplettSoknadModal(
                                                true,
                                            );
                                        }
                                    }}
                                >
                                    {t('soknad.knapper.sendInn')}
                                </Button>
                            )}

                            {
                                soknadHarNoeInnlevert && !soknadKlar && (
                                    <Button
                                        onClick={() => {
                                            if (
                                                lastOppVedleggHarFeil
                                            ) {
                                                setLastOppVedleggValideringfokus(
                                                    true,
                                                );
                                                setVisLastOppVedleggFeil(
                                                    true,
                                                );
                                                return;
                                            }
                                            if (
                                                !sendInnUferdigSoknadModal
                                            ) {
                                                setSendInnUferdigSoknadModal(
                                                    true,
                                                );
                                            }
                                        }}
                                    >
                                        {t(
                                            'soknad.knapper.sendInnUfullstendig',
                                        )}
                                    </Button>
                                )
                                // dette virker nå, men du må reloade
                            }

                            {/* lagre og fortsett senere */}
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    if (!fortsettSenereSoknadModal) {
                                        setForstettSenereSoknadModal(
                                            true,
                                        );
                                    }
                                }}
                            >
                                {t('soknad.knapper.fortsettSenere')}
                            </Button>
                        </>
                    )}
                    {/* gå tilbake et steg */}
                    {visSteg0 && (
                        <Button
                            onClick={() => {
                                oppdaterVisningsSteg(1);
                            }}
                        >
                            {t('soknad.knapper.neste')}
                        </Button>
                    )}
                    {/* gå frem et steg */}
                    {visSteg1 && (
                        <>
                            <Button
                                onClick={() => {
                                    if (side1HarFeil) {
                                        setSide1Valideringfokus(true);
                                        setVisSide1Feil(true);
                                        return;
                                    }
                                    oppdaterVisningsSteg(1);
                                }}
                            >
                                {t('soknad.knapper.neste')}
                            </Button>
                            <Button
                                onClick={() => {
                                    oppdaterVisningsSteg(-1);
                                }}
                                variant="secondary"
                            >
                                {t('soknad.knapper.forrige')}
                            </Button>
                        </>
                    )}
                    {visLastOppVedlegg &&
                        visningsType === 'dokumentinnsending' && (
                            <Button
                                onClick={() => {
                                    oppdaterVisningsSteg(-1);
                                }}
                                variant="secondary"
                            >
                                {t('soknad.knapper.forrige')}
                            </Button>
                        )}
                    {/*kall slettsøknad på api, deretter, gå til ditt nav
kanskje popup om at dette vil slette innhold? */}
                    <Button
                        onClick={() => {
                            if (!slettSoknadModal) {
                                setSlettSoknadModal(true);
                            }
                        }}
                        variant="tertiary"
                    >
                        {visLastOppVedlegg
                            ? t('soknad.knapper.slett')
                            : t('soknad.knapper.avbryt')}
                    </Button>
                </ButtonContainer>
            )}
            <div>
                <FellesModal
                    open={fortsettSenereSoknadModal}
                    setOpen={setForstettSenereSoknadModal}
                    onAccept={tilMinSide}
                    acceptButtonText={t(
                        'modal.fortsettSenere.accept',
                    )}
                    cancelButtonText={t(
                        'modal.fortsettSenere.cancel',
                    )}
                >
                    <Heading spacing size="medium">
                        {t('modal.fortsettSenere.tittel')}
                    </Heading>
                    <BodyLong as="ul">
                        {t('modal.fortsettSenere.liste', {
                            returnObjects: true,
                        }).map((element, key) => (
                            <li key={key}>{element}</li>
                        ))}
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={slettSoknadModal}
                    setOpen={setSlettSoknadModal}
                    isLoading={isLoading}
                    onAccept={slett}
                    acceptButtonText={t('modal.slett.accept')}
                    cancelButtonText={t('modal.slett.cancel')}
                >
                    <Heading spacing size="medium">
                        {t('modal.slett.tittel')}
                    </Heading>
                    <BodyLong as="ul">
                        {t('modal.slett.liste', {
                            returnObjects: true,
                        }).map((element, key) => (
                            <li key={key}>{element}</li>
                        ))}
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={sendInnUferdigSoknadModal}
                    setOpen={setSendInnUferdigSoknadModal}
                    onAccept={onSendInn}
                    isLoading={isLoading}
                    acceptButtonText={t(
                        'modal.sendInnUferdig.accept',
                    )}
                    cancelButtonText={t(
                        'modal.sendInnUferdig.cancel',
                    )}
                >
                    <Heading spacing size="medium">
                        {t('modal.sendInnUferdig.tittel')}
                    </Heading>
                    <BodyLong as="ul">
                        {t('modal.sendInnUferdig.liste', {
                            dato: formatertDato(
                                seksUkerFraDato(
                                    new Date(soknad.opprettetDato),
                                ),
                            ),
                            returnObjects: true,
                        }).map((element, key) => (
                            <li key={key}>{element}</li>
                        ))}
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={sendInnKomplettSoknadModal}
                    setOpen={setSendInnKomplettSoknadModal}
                    onAccept={onSendInn}
                    isLoading={isLoading}
                    acceptButtonText={t(
                        'modal.sendInnKomplett.accept',
                    )}
                    cancelButtonText={t(
                        'modal.sendInnKomplett.cancel',
                    )}
                >
                    <Heading spacing size="medium">
                        {t('modal.sendInnKomplett.tittel')}
                    </Heading>
                    <BodyLong as="ul">
                        {t('modal.sendInnKomplett.liste', {
                            returnObjects: true,
                        }).map((element, key) => (
                            <li key={key}>{element}</li>
                        ))}
                    </BodyLong>
                </FellesModal>
            </div>
        </Style>
    );
}
export default VedleggsListe;
