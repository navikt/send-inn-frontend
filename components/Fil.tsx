import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTIONS, ActionType } from './Vedlegg';
import {
    OpplastetFil,
    VedleggType,
    oppdaterLokalOpplastingStatusType,
} from '../types/types';
import {
    Alert,
    Heading,
    BodyLong,
    Button,
    Panel,
    Detail,
    Label,
    Link as NavLink,
} from '@navikt/ds-react';
import styled from 'styled-components';
import { FIL_STATUS } from '../types/enums';
import { FilUploadIcon } from './FilUploadIcon';
import getConfig from 'next/config';
import { Filvelger } from './Filvelger';

const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.apiUrl;

export const FilePanel = styled(Panel)`
    border-width: 2px;
    border-radius: 8px;

    .icon {
    }
    .filename {
        grid-area: filename;
        color: gray;
        justify-items: left;
    }
    .fileinfo {
        grid-area: fileinfo;
        justify-items: left;
    }
    .hoyreHalvdel {
        grid-area: hoyreHalvdel;
        display: flex;
        flex-flow: column wrap;
        align-content: flex-end;
    }

    display: grid;

    grid-template-columns: 53px auto auto;
    grid-template-areas:
        'icon filename hoyreHalvdel hoyreHalvdel'
        'icon fileinfo hoyreHalvdel hoyreHalvdel';

    ${(props) =>
        props.type === FIL_STATUS.FEIL &&
        'border-color: var(--navds-semantic-color-interaction-danger)'};
`;

const StyledButton = styled.div`
    > * {
        border-radius: 8px;
    }
`;

const StyledSecondaryButton = styled(StyledButton)`
    > * {
        --navds-button-color-secondary-border: var(
            --navds-semantic-color-feedback-info-background
        );
        background-color: var(
            --navds-semantic-color-feedback-info-background
        );
    }
`;

const StyledTertiaryButton = styled(StyledButton)``;

export interface FilProps {
    komponentID: string;
    vedlegg: VedleggType;
    innsendingsId: string;
    lokalFil?: File;
    opplastetFil?: OpplastetFil;
    filListeDispatch: React.Dispatch<ActionType>;
    oppdaterLokalOpplastingStatus: oppdaterLokalOpplastingStatusType;
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
    LAST_OPP_NY_FIL: 'LAST_OPP_NY_FIL',
    AVBRYT: 'AVBRYT',
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

const filStorrelseVisning = (bytes: number): string => {
    const enheter = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 B';
    const indeksIEnheter = Math.floor(
        Math.log(bytes) / Math.log(1024),
    );
    const enhet = enheter[indeksIEnheter];
    const storrelserIEnhet = Math.round(
        bytes / Math.pow(1024, indeksIEnheter),
    );

    return `${storrelserIEnhet}${enhet}`;
};

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
        case FIL_ACTIONS.LAST_OPP_NY_FIL: {
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
    oppdaterLokalOpplastingStatus,
}: FilProps) {
    const [filState, dispatch] = useReducer(filReducer, initialState);
    const { status } = filState;
    const [controller] = useState(new AbortController());

    const slettFil = () => {
        dispatch({
            type: FIL_ACTIONS.SETT_STATUS,
            filState: { status: FIL_STATUS.SLETTER },
        });
        if (!filState.filData.opplastetFil) {
            filListeDispatch({
                type: ACTIONS.SLETT_FIL,
                filData: { komponentID },
            });
            return;
        }
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
                                storrelse: response.data.storrelse,
                            },
                        },
                    },
                });
                oppdaterLokalOpplastingStatus(
                    vedlegg.id,
                    'LastetOpp',
                );
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
        oppdaterLokalOpplastingStatus,
        vedlegg,
        controller.signal,
        status,
    ]);

    const filnavn =
        filState.filData.opplastetFil?.filnavn ||
        filState.filData.lokalFil?.name;

    return (
        <div>
            {/* TODO why does one status work but not the other styled div vs panel?*/}
            <FilePanel type={status} border>
                <FilUploadIcon filstatus={status} />
                <div className="filename">
                    {status === FIL_STATUS.OPPLASTET ? (
                        <div>
                            <NavLink
                                target="_blank"
                                href={`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${filState.filData.opplastetFil?.id}`}
                                rel="noopener noreferrer"
                            >
                                {filnavn}
                            </NavLink>
                            <Detail size="small">
                                {filStorrelseVisning(
                                    filState.filData.opplastetFil
                                        ?.storrelse,
                                )}
                            </Detail>
                        </div>
                    ) : (
                        filnavn
                    )}
                </div>
                <div className="fileinfo">
                    {status === FIL_STATUS.LASTER_OPP && (
                        <span>Progress: {filState.progress}</span>
                    )}
                </div>

                <div className="hoyreHalvdel">
                    {status === FIL_STATUS.FEIL &&
                        !filState.filData?.opplastetFil && (
                            <StyledSecondaryButton>
                                <Filvelger
                                    onFileSelected={(fil: File) =>
                                        dispatch({
                                            type: FIL_ACTIONS.LAST_OPP_NY_FIL,
                                            filState: {
                                                filData: {
                                                    lokalFil: fil,
                                                },
                                            },
                                        })
                                    }
                                    CustomButton={({ children }) => (
                                        <Button
                                            as="label"
                                            variant="secondary"
                                        >
                                            Prøv igjen
                                            {children}
                                        </Button>
                                    )}
                                    allowMultiple={false}
                                />
                            </StyledSecondaryButton>
                        )}

                    {status === FIL_STATUS.LASTER_OPP && (
                        <StyledTertiaryButton>
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
                                as="label"
                                variant="tertiary"
                            >
                                Avbryt
                            </Button>
                        </StyledTertiaryButton>
                    )}

                    <StyledTertiaryButton>
                        <Button
                            onClick={slettFil}
                            as="label"
                            variant="tertiary"
                        >
                            Fjern
                        </Button>
                    </StyledTertiaryButton>
                </div>
            </FilePanel>
        </div>
    );
}
