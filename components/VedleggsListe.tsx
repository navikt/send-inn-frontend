import React, {
    createContext,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import {
    VedleggType,
    SoknadType,
    OpplastingsStatus,
} from '../types/types';
import { ExtendedVedleggType } from '../components/Vedlegg';
import SkjemaNedlasting from '../components/SkjemaNedlasting';
import SkjemaOpplasting from './SkjemaOpplasting';
import Kvittering, { KvitteringsDto } from '../components/Kvittering';
import getConfig from 'next/config';
import styled from 'styled-components';
import { useSoknadLanguage } from '../hooks/useSoknadLanguage';
import LastOppVedlegg from './LastOppVedlegg';
import { SoknadModalProvider } from './SoknadModalProvider';
import { navigerTilMinSide } from '../utils/navigerTilMinSide';
import { AutomatiskInnsending } from './AutomatiskInnsending';
import { erDatoIAvviksPeriode } from '../utils/midlertidigAvviksPeriode';

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

const soknadErKomplett = (vedleggsliste: VedleggType[]): boolean =>
    vedleggsliste
        .filter((element) => element.erPakrevd === true)
        .every((element) => {
            return (
                element.opplastingsStatus === 'LastetOpp' ||
                element.opplastingsStatus === 'SendesAvAndre' ||
                element.opplastingsStatus === 'Innsendt'
            );
        });

const soknadKanSendesInn = (vedleggsliste: VedleggType[]): boolean =>
    vedleggsliste
        .filter((element) => element.erHoveddokument === true)
        .every(
            (element) => element.opplastingsStatus === 'LastetOpp',
        );

interface VedleggslisteContextType {
    soknad: SoknadType;
    soknadKlar: boolean;
    soknadDelvisKlar: boolean;
    onSendInn: () => Promise<void>;
    slettSoknad: () => void;
    setOpplastingStatus: (
        id: number,
        status: string,
    ) => Promise<void>;
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
    useSoknadLanguage(soknad.spraak);

    const soknadKlar = useMemo(
        () => soknadErKomplett(vedleggsliste),
        [vedleggsliste],
    );
    const soknadDelvisKlar = useMemo(
        () => soknadKanSendesInn(vedleggsliste),
        [vedleggsliste],
    );

    const [visningsSteg, setVisningsSteg] = useState(
        soknad.visningsSteg,
    );

    const [isLoading, setisLoading] = useState(false);

    const [visKvittering, setVisKvittering] = useState(false);
    const [soknadsInnsendingsRespons, setSoknadsInnsendingsRespons] =
        useState(null);

    const { visningsType, kanLasteOppAnnet } = soknad;

    const vedleggsListeContainer = useRef(null);

    const erFraFyllutUtenVedlegg =
        !visKvittering &&
        //TODO: erDatoIAvviksPeriode kan fjernes i februar 2023
        //Søknader i avviksperioden må gå til siden for LastOppVedlegg, selv om de ikke har vedlegg
        !erDatoIAvviksPeriode(soknad.opprettetDato) &&
        visningsType === 'fyllUt' &&
        vedleggsliste.every((vedlegg) => vedlegg.erHoveddokument) &&
        !kanLasteOppAnnet;

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
        !erFraFyllutUtenVedlegg &&
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

    const setOpplastingStatus = useCallback(
        (id: number, status: string): Promise<void> =>
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
                    throw error;
                }),
        [setVedleggsListe, showError, soknad.innsendingsId],
    );

    const oppdaterLokalOpplastingStatus = (
        id: number,
        opplastingsStatus: OpplastingsStatus,
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

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };
    return (
        <VedleggslisteContext.Provider
            value={{
                soknad,
                soknadKlar,
                soknadDelvisKlar,
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
                    {/* // Er fra Fyllut uten vedlegg */}
                    {erFraFyllutUtenVedlegg && (
                        <AutomatiskInnsending />
                    )}
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
