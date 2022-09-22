import React, { useEffect, useReducer } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {
    Panel,
    Heading,
    Link as NavLink,
    BodyLong,
    Ingress,
    Button,
    BodyShort,
    Label,
} from '@navikt/ds-react';
import { Filvelger } from './Filvelger';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import VedleggRadio from '../components/VedleggRadio';

import {
    setOpplastingStatusType,
    OpplastetFil,
    VedleggType,
    oppdaterLokalOpplastingStatusType,
} from '../types/types';
import { EndreVedlegg } from './EndreVedlegg';
import { Fil, FilePanel } from './Fil';
import getConfig from 'next/config';
import { FilUploadIcon } from './FilUploadIcon';
import { FIL_STATUS } from '../types/enums';

const { publicRuntimeConfig } = getConfig();

export interface VedleggProps {
    vedlegg: VedleggType | null;
    innsendingsId: string;
    setOpplastingStatus: setOpplastingStatusType;
    oppdaterLokalOpplastingStatus: oppdaterLokalOpplastingStatusType;
    erAnnetVedlegg?: boolean;
    slettAnnetVedlegg: (id: number) => void;
}

export interface FilData {
    komponentID?: string;
    lokalFil?: File;
    opplastetFil?: OpplastetFil;
}

export const ACTIONS = {
    NY_FIL: 'NY_FIL',
    SLETT_FIL: 'SLETT_FIL',
    ENDRE_FIL: 'ENDRE_FIL',
    RESET_LISTE: 'RESET_LISTE',
} as const;

export interface ActionType {
    type: typeof ACTIONS[keyof typeof ACTIONS];
    filData?: FilData;
}

const filListeReducer = (filListe: FilData[], action: ActionType) => {
    switch (action.type) {
        case ACTIONS.NY_FIL: {
            return [
                ...filListe,
                { komponentID: uuidv4(), ...action.filData },
            ];
        }
        case ACTIONS.SLETT_FIL: {
            return filListe.filter(
                (fil) =>
                    fil.komponentID !== action.filData.komponentID,
            );
        }
        case ACTIONS.RESET_LISTE: {
            return initialState;
        }
    }
};

const initialState: FilData[] = [];

const VedleggPanel = styled(Panel)`
    background-color: var(--navds-semantic-color-canvas-background);
`;

const VedleggBeskrivelse = styled(BodyShort)`
    margin-bottom: 24px;
`;

const VedleggButtons = styled.div`
    display: flex;
    gap: 20px;
`;

function Vedlegg(props: VedleggProps) {
    const {
        innsendingsId,
        vedlegg,
        setOpplastingStatus,
        slettAnnetVedlegg,
        oppdaterLokalOpplastingStatus,
    } = props;

    const [filListe, dispatch] = useReducer(
        filListeReducer,
        initialState,
    );
    const [endrer, setEndrer] = useState(false);
    const [tittel, setTittel] = useState(vedlegg.label);

    const erAnnetVedlegg =
        vedlegg.vedleggsnr?.toUpperCase() === 'N6' &&
        !vedlegg.erPakrevd;
    const erSendtInnTidligere = vedlegg.innsendtdato !== null;
    const skjulFiler =
        vedlegg.opplastingsStatus === 'SendSenere' ||
        vedlegg.opplastingsStatus === 'SendesAvAndre';

    useEffect(() => {
        console.log({ filListe });
    }, [filListe]);

    useEffect(() => {
        if (innsendingsId && vedlegg.id) {
            axios
                .get(
                    `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/`,
                )
                .then((response) => {
                    const responseJSON = response.data;
                    console.log({ responseJSON });
                    for (const item in responseJSON) {
                        const jsonitem = responseJSON[item];
                        const nyFil: FilData = {
                            opplastetFil: {
                                id: jsonitem.id,
                                filnavn: jsonitem.filnavn,
                                storrelse: jsonitem.storrelse,
                            },
                        };
                        dispatch({
                            type: ACTIONS.NY_FIL,
                            filData: nyFil,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        return () =>
            dispatch({
                type: ACTIONS.RESET_LISTE,
            });
    }, [innsendingsId, vedlegg.id]);

    return (
        <VedleggPanel>
            {endrer ? (
                <EndreVedlegg
                    tittel={tittel}
                    vedlegg={vedlegg}
                    innsendingsId={innsendingsId}
                    setEndrer={setEndrer}
                    setTittel={setTittel}
                />
            ) : (
                <>
                    <div>
                        {!vedlegg.erHoveddokument &&
                            vedlegg.skjemaurl && (
                                <a
                                    className="navds-link"
                                    target="_blank"
                                    style={{ color: 'blue' }}
                                    href={vedlegg.skjemaurl}
                                    rel="noopener noreferrer"
                                >
                                    Åpne skjema
                                </a>
                            )}
                    </div>
                    <div>
                        <div>
                            <Heading size="small" spacing>
                                {tittel}
                            </Heading>
                        </div>
                        <div>
                            {vedlegg.erHoveddokument && (
                                <BodyLong>
                                    <Ingress>Slik gjør du:</Ingress>
                                    <ol>
                                        <li>
                                            Klikk på “Last opp utfylt
                                            skjema”.{' '}
                                        </li>
                                        <li>
                                            Finn og last opp det
                                            ferdig utfylte skjemaet.
                                        </li>
                                        <li>Klikk på “Gå videre”.</li>
                                        <li>
                                            Hvis du skal sende inn
                                            vedlegg blir du bedt om å
                                            gjøre det i neste steg.
                                        </li>
                                    </ol>
                                </BodyLong>
                            )}
                        </div>
                    </div>
                    {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}

                    {vedlegg.beskrivelse && (
                        <VedleggBeskrivelse size="small">
                            {vedlegg.beskrivelse}
                        </VedleggBeskrivelse>
                    )}

                    {vedlegg.erPakrevd &&
                        !vedlegg.erHoveddokument &&
                        !erSendtInnTidligere && (
                            <VedleggRadio
                                id={vedlegg.id}
                                vedlegg={vedlegg}
                                setOpplastingStatus={
                                    setOpplastingStatus
                                }
                            />
                        )}

                    {erSendtInnTidligere && (
                        <div>
                            <Heading size="xsmall" spacing as="p">
                                Dokumenter du har sendt inn tidligere:
                            </Heading>
                            <FilePanel border>
                                <FilUploadIcon
                                    filstatus={
                                        FIL_STATUS.TIDLIGERE_LASTET_OPP
                                    }
                                />
                                <div className="filename">
                                    {vedlegg.label}
                                </div>
                                <div className="hoyreHalvdel">
                                    <span>Mottatt</span>
                                    <span>
                                        {new Date(
                                            vedlegg.innsendtdato,
                                        ).toLocaleString('no', {
                                            dateStyle: 'short',
                                        })}
                                    </span>
                                </div>
                            </FilePanel>

                            <br />
                        </div>
                    )}

                    {!skjulFiler && (
                        <VedleggButtons>
                            <Filvelger
                                onFileSelected={(fil: File) =>
                                    dispatch({
                                        type: ACTIONS.NY_FIL,
                                        filData: {
                                            lokalFil: fil,
                                        },
                                    })
                                }
                            />

                            {erAnnetVedlegg && (
                                <>
                                    <Button
                                        onClick={() =>
                                            setEndrer(true)
                                        }
                                        variant="secondary"
                                    >
                                        Rediger
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            slettAnnetVedlegg(
                                                vedlegg.id,
                                            )
                                        }
                                        variant="secondary"
                                    >
                                        Slett vedlegg
                                    </Button>
                                </>
                            )}
                        </VedleggButtons>
                    )}

                    {!skjulFiler && filListe.length > 0 && (
                        <div>
                            <Heading size="xsmall" spacing as="p">
                                Dokumenter du har lastet opp nå:
                            </Heading>
                            {filListe.map((fil) => {
                                return (
                                    <Fil
                                        key={fil.komponentID}
                                        komponentID={fil.komponentID}
                                        vedlegg={vedlegg}
                                        innsendingsId={innsendingsId}
                                        lokalFil={fil.lokalFil}
                                        opplastetFil={
                                            fil.opplastetFil
                                        }
                                        filListeDispatch={dispatch}
                                        oppdaterLokalOpplastingStatus={
                                            oppdaterLokalOpplastingStatus
                                        }
                                    />
                                );
                            })}
                            <br />
                        </div>
                    )}
                </>
            )}
        </VedleggPanel>
    );
}
export default Vedlegg;
