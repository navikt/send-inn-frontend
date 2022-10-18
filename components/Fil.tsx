import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { ACTIONS, ActionType } from './Vedlegg';
import {
    OpplastetFil,
    VedleggType,
    oppdaterLokalOpplastingStatusType,
} from '../types/types';
import {
    Button,
    Panel,
    BodyShort,
    Link as NavLink,
} from '@navikt/ds-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FIL_STATUS } from '../types/enums';
import { FilUploadIcon } from './FilUploadIcon';
import getConfig from 'next/config';
import { Filvelger } from './Filvelger';
import { useValidation } from '../hooks/useValidation';
import { ErrorMessageWithDot } from './textStyle';

const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.apiUrl;

export const FilePanel = styled(Panel)`
    border-width: 2px;
    border-radius: 8px;

    .icon {
        grid-area: icon;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .filename {
        grid-area: filename;
        color: gray;
        justify-items: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }
    }
    .fileinfo {
        grid-area: fileinfo;
        justify-items: left;
    }
    .hoyreHalvdel {
        grid-area: hoyreHalvdel;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        @media only screen and (max-width: 600px) {
            justify-content: center;
            margin-top: 16px;
            width: 100%;
        }
    }

    display: grid;

    grid-template-columns: 53px auto auto;
    grid-template-areas:
        'icon filename hoyreHalvdel hoyreHalvdel'
        'icon fileinfo hoyreHalvdel hoyreHalvdel';

    padding: 12px 8px;

    ${(props) =>
        props.type === FIL_STATUS.FEIL &&
        'border-color: var(--navds-semantic-color-interaction-danger)'};

    @media only screen and (max-width: 600px) {
        grid-template-areas:
            'icon filename filename'
            'icon fileinfo fileinfo'
            'hoyreHalvdel hoyreHalvdel hoyreHalvdel';

        button,
        label {
            width: 100%;
        }
    }
`;

const StyledButton = styled.div`
    /* button,
    label {
        border-radius: 4px;
    } */
    @media only screen and (max-width: 600px) {
        width: 100%;
    }
`;

const StyledProvIgjenButton = styled(StyledButton)`
    label {
        background-color: var(
            --navds-semantic-color-interaction-primary-hover-subtle
        );
    }
    label:hover {
        background-color: var(
            --navds-semantic-color-interaction-primary-hover
        );
        color: var(--navds-semantic-color-text-inverted);
    }
`;

const StyledTertiaryButton = styled(StyledButton)`
    @media only screen and (max-width: 600px) {
        :first-child {
            border-top: 1px solid var(--navds-semantic-color-divider);
        }
        :first-child:last-child {
            margin-bottom: -0.75rem;
        }
    }
`;

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

    return `${storrelserIEnhet} ${enhet}`;
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
    const { t } = useTranslation();
    const [feilmelding, setFeilmelding] = useState<string>(null);
    const { showError } = useErrorMessage();

    const filnavn =
        filState.filData.opplastetFil?.filnavn ||
        filState.filData.lokalFil?.name;

    useValidation({
        komponentId: komponentID,
        melding: t(
            'soknad.vedlegg.fil.feilmelding.provIgjenEllerFjern',
            { filnavn },
        ),
        harFeil:
            status !== FIL_STATUS.OPPLASTET &&
            status !== FIL_STATUS.TIDLIGERE_LASTET_OPP &&
            status !== FIL_STATUS.LASTER_OPP,
    });

    useValidation({
        komponentId: komponentID,
        melding: t(
            'soknad.vedlegg.fil.feilmelding.ikkeFerdigOpplastet',
        ),
        harFeil: status === FIL_STATUS.LASTER_OPP,
    });

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
            .delete<VedleggType>(
                `${API_URL}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${filState.filData.opplastetFil.id}`,
            )
            .then((response) => {
                filListeDispatch({
                    type: ACTIONS.SLETT_FIL,
                    filData: { komponentID },
                });
                oppdaterLokalOpplastingStatus(
                    vedlegg.id,
                    response.data.opplastingsStatus,
                );
            })
            .catch((error) => {
                dispatch({
                    type: FIL_ACTIONS.FEIL,
                });
                showError(error);
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
                const filData = {
                    opplastetFil: {
                        id: response.data.id,
                        filnavn: filState.filData.lokalFil.name,
                        storrelse: response.data.storrelse,
                    },
                };
                dispatch({
                    type: FIL_ACTIONS.OPPLASTET,
                    filState: {
                        filData,
                    },
                });
                filListeDispatch({
                    type: ACTIONS.ENDRE_FIL,
                    filData: {
                        ...filData,
                        komponentID,
                    },
                });
                oppdaterLokalOpplastingStatus(
                    vedlegg.id,
                    'LastetOpp',
                );
                console.log({ response: response.data });
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    // avbrutt av bruker
                    return;
                }
                dispatch({
                    type: FIL_ACTIONS.FEIL,
                });
                const { errorCode } = error?.response?.data || {};
                if (
                    errorCode ===
                        'errorCode.illegalAction.notSupportedFileFormat' ||
                    errorCode ===
                        'errorCode.illegalAction.fileCannotBeRead'
                ) {
                    return setFeilmelding(
                        t(errorCode, {
                            ns: 'backend',
                        }),
                    );
                } else if (
                    errorCode ===
                    'errorCode.illegalAction.fileSizeSumTooLarge'
                ) {
                    setFeilmelding(
                        t(errorCode, {
                            ns: 'backend',
                        }),
                    );
                }
                showError(error);
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
        filListeDispatch,
        komponentID,
        t,
        showError,
    ]);

    return (
        <li>
            {/* TODO why does one status work but not the other styled div vs panel?*/}
            <FilePanel
                type={status}
                border
                id={komponentID}
                tabIndex={-1}
            >
                <div className="icon">
                    <FilUploadIcon filstatus={status} />
                </div>
                <div className="filename">
                    {status === FIL_STATUS.OPPLASTET ? (
                        <NavLink
                            target="_blank"
                            href={`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}/fil/${filState.filData.opplastetFil?.id}`}
                            rel="noopener noreferrer"
                        >
                            {filnavn}
                        </NavLink>
                    ) : (
                        filnavn
                    )}
                </div>
                <div className="fileinfo">
                    {status === FIL_STATUS.LASTER_OPP && (
                        <BodyShort size="small">
                            Progress: {filState.progress}
                        </BodyShort>
                    )}
                    {status === FIL_STATUS.OPPLASTET && (
                        <BodyShort size="small">
                            {filStorrelseVisning(
                                filState.filData.opplastetFil
                                    ?.storrelse,
                            )}
                        </BodyShort>
                    )}
                </div>

                <div className="hoyreHalvdel">
                    {status === FIL_STATUS.FEIL &&
                        !filState.filData?.opplastetFil && (
                            <StyledProvIgjenButton>
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
                                    CustomButton={
                                        <Button
                                            as="label"
                                            variant="tertiary"
                                        >
                                            {t(
                                                'soknad.vedlegg.fil.provIgjen',
                                            )}
                                        </Button>
                                    }
                                    allowMultiple={false}
                                />
                            </StyledProvIgjenButton>
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
                                variant="tertiary"
                            >
                                {t('soknad.vedlegg.fil.avbryt')}
                            </Button>
                        </StyledTertiaryButton>
                    )}

                    {status !== FIL_STATUS.LASTER_OPP && (
                        <StyledTertiaryButton>
                            <Button
                                onClick={slettFil}
                                variant="tertiary"
                                aria-label={`${t(
                                    'soknad.vedlegg.fil.slett',
                                )} ${filnavn}`}
                            >
                                {t('soknad.vedlegg.fil.slett')}
                            </Button>
                        </StyledTertiaryButton>
                    )}
                </div>
            </FilePanel>
            {status === FIL_STATUS.FEIL && (
                <ErrorMessageWithDot>
                    {feilmelding}
                </ErrorMessageWithDot>
            )}
        </li>
    );
}
