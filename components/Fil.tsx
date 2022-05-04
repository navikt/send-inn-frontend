import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTIONS, ActionType } from './Vedlegg';
import {
    OpplastetFil,
    VedleggType,
    setOpplastingStatusType,
} from '../types/types';
import { Button } from '@navikt/ds-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FilProps {
    komponentID: string;
    vedlegg: VedleggType;
    innsendingsId: string;
    lokalFil?: File;
    opplastetFil?: OpplastetFil;
    filListeDispatch: React.Dispatch<ActionType>;
    setOpplastingStatus: setOpplastingStatusType;
}

export interface FilData {
    komponentID?: string;
    lokalFil?: File;
    opplastetFil?: OpplastetFil;
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
    SLETTER: 'SLETTER',
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
    console.debug('Dispatcher:', action.type);
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
            console.debug('Status:', action.filState.status);
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
    const [controller] = useState(new AbortController());

    const slettFil = () => {
        dispatch({
            type: FIL_ACTIONS.SETT_STATUS,
            filState: { status: FIL_STATUS.SLETTER },
        });
        axios
            .delete(
                `${API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${filState.filData.opplastetFil.id}`,
            )
            .then(() => {
                filListeDispatch({
                    type: ACTIONS.SLETT_FIL,
                    filData: { komponentID },
                });
            })
            .catch((error) => {
                console.error(error);
                dispatch({
                    type: FIL_ACTIONS.FEIL,
                });
            });
    };

    useEffect(() => {
        console.log(status);
        if (status === FIL_STATUS.OPPRETTET) {
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

        const formData = new FormData();
        formData.append('file', filState.filData?.lokalFil);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            signal: controller.signal,
            onUploadProgress: (progressEvent: ProgressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) /
                        progressEvent.total,
                );
                dispatch({
                    type: FIL_ACTIONS.OPPDATER_PROGRESS,
                    filState: { progress },
                });
                console.debug({ progress });
            },
        };
        dispatch({
            type: FIL_ACTIONS.SETT_STATUS,
            filState: { status: FIL_STATUS.LASTER_OPP },
        });

        axios
            .post(
                `${API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil`,
                formData,
                config,
            )
            .then((response) => {
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
            <span>{status}</span>
            <a
                target="_blank"
                style={{ color: 'blue' }}
                href={`${process.env.NEXT_PUBLIC_API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${filState.filData.opplastetFil?.id}`}
                rel="noreferrer"
            >
                {filState.filData.opplastetFil?.filnavn}
            </a>
            Fil:{' '}
            {filState.filData.opplastetFil?.filnavn ||
                filState.filData.lokalFil?.name}{' '}
            | {komponentID} | Status: {status} |
            {status === FIL_STATUS.LASTER_OPP && (
                <>Progress: {filState.progress} |</>
            )}
            {status === FIL_STATUS.FEIL &&
                !filState.filData?.opplastetFil && (
                    <Button
                        onClick={() =>
                            dispatch({
                                type: FIL_ACTIONS.START_OPPLASTNING,
                                filState: {
                                    filData: {
                                        opplastetFil:
                                            opplastetFilProp,
                                        lokalFil: lokalFilProp,
                                    },
                                },
                            })
                        }
                    >
                        Prøv igjen
                    </Button>
                )}
            {status === FIL_STATUS.LASTER_OPP && (
                <Button
                    onClick={() => {
                        controller.abort();
                        dispatch({
                            type: FIL_ACTIONS.AVBRYT,
                        });
                        filListeDispatch({
                            type: ACTIONS.SLETT_FIL,
                            filData: { komponentID },
                        });
                    }}
                >
                    Avbryt
                </Button>
            )}
            <Button
                loading={status === FIL_STATUS.SLETTER}
                onClick={slettFil}
            >
                Slett
            </Button>
        </div>
    );
}
