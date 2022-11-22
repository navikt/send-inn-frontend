import React, { createContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { VedleggType, SoknadType } from '../types/types';
import Vedlegg, { ExtendedVedleggType } from '../components/Vedlegg';
import SkjemaNedlasting from '../components/SkjemaNedlasting';
import Skjemaopplasting from '../components/Skjemaopplasting';
import Kvittering, { KvitteringsDto } from '../components/Kvittering';
import { Button, Alert } from '@navikt/ds-react';
import { Heading, Ingress, BodyLong } from '@navikt/ds-react';
import { FellesModal } from './FellesModal';
import { useTranslation } from 'react-i18next';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import {
    formatertDato,
    seksUkerFraDato,
} from '../components/Kvittering';
import getConfig from 'next/config';
import styled from 'styled-components';
import { SideValideringProvider } from './SideValideringProvider';
import LastOppVedlegg from './LastOppVedlegg';
import { ModalContextProvider } from './ModalContextProvider';

const { publicRuntimeConfig } = getConfig();

const initialVedleggsliste: VedleggType[] | [] = [];

const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
    outline: none;
`;

const PaddedVedlegg = styled.div`
    > * {
        margin-top: 16px;
    }
`;

export const ButtonContainer = styled.div`
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

function soknadErKomplett(vedleggsliste: VedleggType[]): boolean {
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

function soknadKanSendesInn(vedleggsliste: VedleggType[]): boolean {
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

interface VedleggslisteContextType {
    soknad: SoknadType;
    soknadKlar: boolean;
    soknadHarNoeInnlevert: boolean;
    onSendInn: () => void;
    slettSoknad: () => void;
    setOpplastingStatus: (id: number, status: string) => void;
    oppdaterLokalOpplastingStatus: (
        id: number,
        opplastingsStatus: string,
    ) => void;
    leggTilVedlegg: (vedlegg: ExtendedVedleggType) => void;
    slettAnnetVedlegg: (vedleggId: number) => void;
}

export const VedleggslisteContext =
    createContext<VedleggslisteContextType>(null);

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

    const { t, i18n } = useTranslation();

    const [isLoading, setisLoading] = useState(false);

    const [visKvittering, setVisKvittering] = useState(false);
    const [soknadsInnsendingsRespons, setSoknadsInnsendingsRespons] =
        useState(null);

    // todo, vi trenger ikke forandre denne verdien lenger som under utvikling, gjør det til en const variabel, venter til
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

    const vedleggsListeContainer = useRef(null);

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

    const slettSoknad = () => {
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

    const oppdaterVisningsSteg = (nr: number) => {
        const nyttVisningsSteg = visningsSteg + nr;
        setVisningsSteg(nyttVisningsSteg);

        axios
            .patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}`,
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

    function setOpplastingStatus(id: number, status: string): void {
        axios
            .patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${id}`,
                {
                    opplastingsStatus: status,
                },
            )
            .then((response) => {
                setVedleggsListe((forrigeVedleggsliste) =>
                    forrigeVedleggsliste.map((el) =>
                        el.id === id ? { ...response.data } : el,
                    ),
                );
            })
            .catch((error) => {
                showError(error);
            });
    }

    const oppdaterLokalOpplastingStatus = (
        id: number,
        opplastingsStatus: string,
    ) => {
        setVedleggsListe((forrigeVedleggsliste) =>
            forrigeVedleggsliste.map((el) =>
                el.id === id ? { ...el, opplastingsStatus } : el,
            ),
        );
    };

    const leggTilVedlegg = (vedlegg: ExtendedVedleggType) => {
        setVedleggsListe((forrigeVedleggsliste) => [
            ...forrigeVedleggsliste,
            vedlegg,
        ]);
    };
    const slettAnnetVedlegg = (vedleggsId: number) => {
        axios
            .delete(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${vedleggsId}`,
            )
            .then(() => {
                setVedleggsListe((forrigeVedleggsliste) =>
                    forrigeVedleggsliste.filter(
                        (el) => el.id !== vedleggsId,
                    ),
                );
            })
            .catch((error) => {
                showError(error);
            });
    };

    // todo fjern duplisert kode
    const tilMinSide = () => {
        console.log('TilMinSide');
        window.location.assign(process.env.NEXT_PUBLIC_MIN_SIDE_URL);
    };

    useEffect(() => {
        setSoknadErKomplett(soknadErKomplett(vedleggsliste));
        setSoknadKanSendesInn(soknadKanSendesInn(vedleggsliste));
    }, [vedleggsliste]);

    useEffect(() => {
        const changeLang = (lng) => {
            // nb / nn / en / se / pl støttede språk per 2022 for dekoratoren

            if (lng === 'no' || lng === 'nb') {
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
        };

        changeLang(soknad.spraak);
        document.documentElement.lang = i18n.language;
    }, [soknad, i18n]);

    useEffect(() => {
        if (
            vedleggsListeContainer.current &&
            (visSteg0 ||
                visSteg1 ||
                visLastOppVedlegg ||
                visKvittering)
        ) {
            vedleggsListeContainer.current.focus();
            if (window.scrollY !== 0) {
                vedleggsListeContainer.current.scrollIntoView(true);
            } else {
                window.scrollTo(0, 0);
            }
        }
    }, [
        vedleggsListeContainer,
        visSteg0,
        visSteg1,
        visLastOppVedlegg,
        visKvittering,
    ]);

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };
    return (
        <VedleggslisteContext.Provider
            value={{
                soknad,
                soknadKlar,
                soknadHarNoeInnlevert,
                onSendInn,
                slettSoknad,
                setOpplastingStatus,
                oppdaterLokalOpplastingStatus,
                leggTilVedlegg,
                slettAnnetVedlegg,
            }}
        >
            <ModalContextProvider>
                {/* 
            todo:
            0 ta ut knapper fra skjemanedlasting
            1 skille vislastoppvedlegg
            2 ta ut prop drilling og bruk kontekst istedenfor
            */}
                <Style ref={vedleggsListeContainer} tabIndex={-1}>
                    {/* // skjemaopplasting, steg 1 */}
                    {visSteg0 &&
                        soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <>
                                <SkjemaNedlasting
                                    vedlegg={
                                        vedleggsliste.filter(
                                            (x) => x.erHoveddokument,
                                        )[0]
                                    }
                                    oppdaterVisningsSteg={
                                        oppdaterVisningsSteg
                                    }
                                    setSlettSoknadModal={
                                        setSlettSoknadModal
                                    }
                                />
                            </>
                        )}

                    {/* skjemanedlasting, steg 2*/}
                    {visSteg1 &&
                        soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <Skjemaopplasting
                                vedlegg={
                                    vedleggsliste.filter(
                                        (x) => x.erHoveddokument,
                                    )[0]
                                }
                                soknad={soknad}
                                oppdaterVisningsSteg={
                                    oppdaterVisningsSteg
                                }
                            />
                        )}
                    {/* vedleggssiden, steg 3 (eller 1) */}
                    {visLastOppVedlegg && (
                        <LastOppVedlegg
                            vedleggsliste={vedleggsliste}
                            oppdaterVisningsSteg={
                                oppdaterVisningsSteg
                            }
                        />
                    )}

                    {/* steg 5 kvitteringsside  */}
                    {visKvittering && (
                        <Kvittering
                            kvprops={soknadsInnsendingsRespons}
                        />
                    )}
                </Style>
            </ModalContextProvider>
        </VedleggslisteContext.Provider>
    );
}
export default VedleggsListe;
