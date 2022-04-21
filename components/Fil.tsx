import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTIONS, ActionType, FilData } from './Vedlegg';
import {
    OpplastetFil,
    VedleggType,
    setOpplastingStatusType,
} from '../types/types';

export interface FilProps {
    komponentID: string;
    vedlegg: VedleggType;
    innsendingsId: string;
    lokalFil?: File;
    opplastetFil?: OpplastetFil;
    filListeDispatch: React.Dispatch<ActionType>;
    setOpplastingStatus: setOpplastingStatusType;
}

export const FIL_ACTIONS = {
    START_OPPLASTNING: 'START_OPPLASTNING',
    OPPDATER_PROGRESS: 'OPPDATER_PROGRESS',
    SETT_STATUS: 'SETT_STATUS',
    OPPLASTET: 'OPPLASTET',
    AVBRYT: 'AVBRYT',
    FEIL: 'FEIL',
} as const;

const FIL_STATUS = {
    OPPRETTET: 'OPPRETTET',
    STARTER_OPPLASTNING: 'STARTER_OPPLASTNING',
    LASTER_OPP: 'LASTER_OPP',
    OPPLASTET: 'OPPLASTET',
    AVBRUTT: 'AVBRUTT',
    FEIL: 'FEIL',
} as const;

export interface FilState {
    filData?: FilData;
    progress?: number;
    status?: typeof FIL_STATUS[keyof typeof FIL_STATUS];
}

export interface FilActionType {
    type: typeof FIL_ACTIONS[keyof typeof FIL_ACTIONS];
    filState?: FilState;
}

const filReducer = (
    filState: FilState,
    action: FilActionType,
): FilState => {
    console.log('Dispatcher:', action.type);
    switch (action.type) {
        case FIL_ACTIONS.START_OPPLASTNING: {
            return {
                ...filState,
                status: FIL_STATUS.STARTER_OPPLASTNING,
                filData: action.filState.filData,
            };
        }
        case FIL_ACTIONS.OPPLASTET: {
            return {
                ...filState,
                status: FIL_STATUS.OPPLASTET,
                filData: action.filState.filData,
            };
        }
        case FIL_ACTIONS.OPPDATER_PROGRESS: {
            return {
                ...filState,
                progress: action.filState.progress,
            };
        }
        case FIL_ACTIONS.AVBRYT: {
            return {
                ...filState,
                status: FIL_STATUS.FEIL,
            };
        }
        case FIL_ACTIONS.FEIL: {
            return {
                ...filState,
                status: FIL_STATUS.FEIL,
            };
        }
        case FIL_ACTIONS.SETT_STATUS: {
            console.log('Status:', action.filState.status);
            return {
                ...filState,
                status: action.filState.status,
            };
        }
    }
};

const initialState: FilState = {
    progress: 0,
    status: FIL_STATUS.OPPRETTET,
    filData: {},
};

export function Fil({
    komponentID,
    opplastetFil: opplastetFilProp,
    lokalFil: lokalFilProp,
    innsendingsId,
    vedlegg,
    filListeDispatch,
    setOpplastingStatus,
}: FilProps) {
    const [filState, dispatch] = useReducer(filReducer, initialState);
    const { status } = filState;
    // const [progress, setProgress] = useState(0);
    // const [opplastetFil, setOpplastetFil] =
    //     useState(opplastetFilProp);

    // const slettFil = () => {
    //     filListeDispatch({
    //         type: ACTIONS.SLETT_FIL,
    //         filData: { komponentID },
    //     });
    // };
    const [controller] = useState(new AbortController());

    useEffect(() => {
        console.log(status);
        if (status === FIL_STATUS.OPPRETTET) {
            console.log('lokalFilProp0', lokalFilProp);
            dispatch({
                type: opplastetFilProp
                    ? FIL_ACTIONS.OPPLASTET
                    : FIL_ACTIONS.START_OPPLASTNING,
                filState: {
                    filData: {
                        opplastetFil: opplastetFilProp,
                        lokalFil: lokalFilProp,
                    },
                },
            });
        }
        if (status !== FIL_STATUS.STARTER_OPPLASTNING) return;

        console.log('lokalFil', filState.filData?.lokalFil);
        console.log('lokalFilProp', lokalFilProp);
        const formData = new FormData();
        formData.append('file', filState.filData?.lokalFil);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            signal: controller.signal,
            onUploadProgress: (progressEvent: ProgressEvent) => {
                console.log('start');
                dispatch({
                    type: FIL_ACTIONS.OPPDATER_PROGRESS,
                    filState: {
                        progress: Math.round(
                            (progressEvent.loaded * 100) /
                                progressEvent.total,
                        ),
                    },
                });
                console.log(
                    Math.round(
                        (progressEvent.loaded * 100) /
                            progressEvent.total,
                    ),
                );
            },
        };
        dispatch({
            type: FIL_ACTIONS.SETT_STATUS,
            filState: { status: FIL_STATUS.LASTER_OPP },
        });

        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil`,
                formData,
                config,
            )
            .then((response) => {
                //setSoknad(response.data);
                dispatch({
                    type: FIL_ACTIONS.OPPLASTET,
                    filState: {
                        filData: {
                            opplastetFil: {
                                id: response.data.id,
                                filnavn:
                                    filState.filData.lokalFil.name,
                            },
                        },
                    },
                });
                setOpplastingStatus(vedlegg.id, 'LASTET_OPP');
                console.log({ response: response.data });
            })
            .catch((error) => {
                console.error(error);
                dispatch({
                    type: FIL_ACTIONS.FEIL,
                });
            })
            .finally(() => {
                dispatch({
                    type: FIL_ACTIONS.OPPDATER_PROGRESS,
                    filState: {
                        progress: 0,
                    },
                });
            });
    }, [
        filState,
        innsendingsId,
        lokalFilProp,
        opplastetFilProp,
        setOpplastingStatus,
        vedlegg,
        controller.signal,
        status,
    ]);

    return (
        <div>
            {/* <span>{status}</span>
            <a
                target="_blank"
                style={{ color: 'blue' }}
                href={`${process.env.NEXT_PUBLIC_API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${opplastetFil.id}`}
                rel="noreferrer"
            >
                {opplastetFil.filnavn}
            </a> */}
            Fil:{' '}
            {filState.filData.opplastetFil?.filnavn ||
                filState.filData.lokalFil?.name}{' '}
            | {komponentID} | Status: {status} |
            {status === FIL_STATUS.LASTER_OPP && (
                <>Progress: {filState.progress} |</>
            )}
            {status === FIL_STATUS.FEIL && (
                <button
                    onClick={() =>
                        dispatch({
                            type: FIL_ACTIONS.START_OPPLASTNING,
                            filState: {
                                filData: {
                                    opplastetFil: opplastetFilProp,
                                    lokalFil: lokalFilProp,
                                },
                            },
                        })
                    }
                >
                    Prøv igjen
                </button>
            )}
            {status === FIL_STATUS.LASTER_OPP && (
                <button
                    onClick={() => {
                        controller.abort();
                        dispatch({
                            type: FIL_ACTIONS.AVBRYT,
                        });
                        filListeDispatch({
                            type: ACTIONS.SLETT_FIL,
                            filData: {
                                komponentID,
                            },
                        });
                    }}
                >
                    Avbryt
                </button>
            )}
            <button
                onClick={() =>
                    filListeDispatch({
                        type: ACTIONS.SLETT_FIL,
                        filData: { komponentID },
                    })
                }
            >
                Slett
            </button>
        </div>
    );
}
