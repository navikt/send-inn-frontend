import React, { createContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { VedleggType, SoknadType } from '../types/types';
import { ExtendedVedleggType } from '../components/Vedlegg';
import SkjemaNedlasting from '../components/SkjemaNedlasting';
import SkjemaOpplasting from './Skjemaopplasting';
import Kvittering, { KvitteringsDto } from '../components/Kvittering';
import { useTranslation } from 'react-i18next';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import getConfig from 'next/config';
import styled from 'styled-components';

import LastOppVedlegg from './LastOppVedlegg';
import { SoknadModalProvider } from './SoknadModalProvider';
import { navigerTilMinSide } from '../lib/navigerTilMinSide';

const { publicRuntimeConfig } = getConfig();

const initialVedleggsliste: VedleggType[] = [];

const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
    outline: none;
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
    vedleggsliste: VedleggType[];
    setVedleggsListe: React.Dispatch<
        React.SetStateAction<VedleggType[]>
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
}: VedleggsListeProps) {
    const { showError } = useErrorMessage();

    const [soknadKlar, setSoknadErKomplett] =
        useState<boolean>(false);
    const [soknadHarNoeInnlevert, setSoknadKanSendesInn] =
        useState<boolean>(false);
    const [visningsSteg, setVisningsSteg] = useState(
        soknad.visningsSteg,
    );

    const { i18n } = useTranslation();

    const [isLoading, setisLoading] = useState(false);

    const [visKvittering, setVisKvittering] = useState(false);
    const [soknadsInnsendingsRespons, setSoknadsInnsendingsRespons] =
        useState(null);

    const { visningsType } = soknad;

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

    const onSendInn = async () => {
        setisLoading(true);
        await axios
            .post(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .then((response) => {
                const kv: KvitteringsDto = response.data;
                setSoknadsInnsendingsRespons(kv);
                setVisKvittering(true);
                resettFokus();
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
                navigerTilMinSide();
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {
                setisLoading(false);
            });
    };

    const resettFokus = () => {
        if (vedleggsListeContainer.current) {
            vedleggsListeContainer.current.focus();
            if (window.scrollY !== 0) {
                vedleggsListeContainer.current.scrollIntoView(true);
            } else {
                window.scrollTo(0, 0);
            }
        }
    };

    const oppdaterVisningsSteg = (nr: number) => {
        const nyttVisningsSteg = visningsSteg + nr;
        setVisningsSteg(nyttVisningsSteg);
        resettFokus();

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
            <SoknadModalProvider isLoading={isLoading}>
                <Style ref={vedleggsListeContainer} tabIndex={-1}>
                    {/* // skjemanedlasting, steg 1 */}
                    {visSteg0 &&
                        soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <SkjemaNedlasting
                                vedlegg={
                                    vedleggsliste.filter(
                                        (x) => x.erHoveddokument,
                                    )[0]
                                }
                                oppdaterVisningsSteg={
                                    oppdaterVisningsSteg
                                }
                            />
                        )}

                    {/* skjemaopplasting, steg 2*/}
                    {visSteg1 &&
                        soknad &&
                        vedleggsliste.length > 0 &&
                        vedleggsliste.filter((x) => x.erHoveddokument)
                            .length > 0 && (
                            <SkjemaOpplasting
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

                    {/* steg 4 kvitteringsside  */}
                    {visKvittering && (
                        <Kvittering
                            kvprops={soknadsInnsendingsRespons}
                        />
                    )}
                </Style>
            </SoknadModalProvider>
        </VedleggslisteContext.Provider>
    );
}
export default VedleggsListe;
