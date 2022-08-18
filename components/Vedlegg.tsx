import React, { useEffect, useReducer } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {
    Panel,
    Heading,
    Link as NavLink,
    BodyLong,
    Ingress,
} from '@navikt/ds-react';
import { Filvelger } from './Filvelger';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import VedleggRadio from '../components/VedleggRadio';

import {
    setOpplastingStatusType,
    OpplastetFil,
    VedleggType,
} from '../types/types';
import { EndreVedlegg } from './EndreVedlegg';
import { Fil } from './Fil';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export interface VedleggProps {
    vedlegg: VedleggType | null;
    innsendingsId: string;
    setOpplastingStatus: setOpplastingStatusType;
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

function Vedlegg(props: VedleggProps) {
    const {
        innsendingsId,
        vedlegg,
        setOpplastingStatus,
        erAnnetVedlegg = vedlegg.vedleggsnr?.toUpperCase() === 'N6' &&
            !vedlegg.erPakrevd,
        slettAnnetVedlegg,
    } = props;

    const [filListe, dispatch] = useReducer(
        filListeReducer,
        initialState,
    );
    const [endrer, setEndrer] = useState(false);
    const [tittel, setTittel] = useState(vedlegg.label);

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
                                {vedlegg.vedleggsnr}: {tittel}
                            </Heading>
                        </div>
                        <div>
                            {vedlegg.erHoveddokument && (
                                <BodyLong>
                                    <Ingress>slik gjør du:</Ingress>

                                    <ol>
                                        <li>
                                            Klikk på “Last ned
                                            skjema”.{' '}
                                        </li>
                                        <li>
                                            Åpne og fyll ut
                                            pdf-skjemaet som lastes
                                            ned.{' '}
                                        </li>
                                        <li>
                                            Lagre skjemaet på enheten
                                            din etter utfylling.
                                        </li>
                                        <li>Klikk på “Gå videre”.</li>
                                    </ol>
                                </BodyLong>
                            )}
                        </div>
                        {!vedlegg.erHoveddokument && erAnnetVedlegg && (
                            <>
                                <NavLink
                                    as="button"
                                    onClick={() => setEndrer(true)}
                                >
                                    Endre
                                </NavLink>
                                <NavLink
                                    as="button"
                                    onClick={() =>
                                        slettAnnetVedlegg(vedlegg.id)
                                    }
                                >
                                    Slett
                                </NavLink>
                            </>
                        )}
                    </div>
                    {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}
                    {vedlegg.beskrivelse && (
                        <div>{vedlegg.beskrivelse}</div>
                    )}
                    <VedleggRadio
                        id={vedlegg.id}
                        vedlegg={vedlegg}
                        setOpplastingStatus={setOpplastingStatus}
                    />
                    <Filvelger filListeDispatch={dispatch} />
                    {filListe.length > 0 && (
                        <div>
                            <span>
                                Dokumenter du har lastet opp nå:
                            </span>
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
                                        setOpplastingStatus={
                                            setOpplastingStatus
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
