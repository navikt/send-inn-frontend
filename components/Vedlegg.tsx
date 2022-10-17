import React, { useEffect, useMemo, useReducer } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';

import {
    Panel,
    Heading,
    Link as NavLink,
    Button,
    BodyShort,
} from '@navikt/ds-react';
import { Filvelger } from './Filvelger';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
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
import { useValidation } from '../hooks/useValidation';
import { ValideringsRamme } from './ValideringsRamme';

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
        case ACTIONS.ENDRE_FIL: {
            return filListe.map((fil) =>
                fil.komponentID === action.filData.komponentID
                    ? action.filData
                    : fil,
            );
        }
        case ACTIONS.RESET_LISTE: {
            return initialState;
        }
    }
};

const initialState: FilData[] = [];

export const VedleggContainer = styled.div<{
    $extraMargin?: boolean;
}>`
    ${(props) => props.$extraMargin && 'margin-bottom: 60px'};
`;

export const VedleggPanel = styled(Panel)`
    background-color: var(--navds-semantic-color-canvas-background);
    border-radius: 8px;
    padding: 24px;
    @media only screen and (max-width: 600px) {
        padding: 12px;
    }
`;

const ListeGruppe = styled.div`
    padding-bottom: 1.5rem;
    @media only screen and (max-width: 600px) {
        ol {
            padding-left: 1.5rem;
        }
    }
`;
const VedleggBeskrivelse = styled(BodyShort)`
    margin-bottom: 24px;
`;

const VedleggButtons = styled.div`
    display: flex;
    gap: 20px;
    @media only screen and (max-width: 475px) {
        flex-direction: column;
        button,
        label {
            width: 100%;
        }
    }
`;

const SendtInnTidligereGruppe = styled.div`
    margin-bottom: 24px;
`;

const FilListeGruppe = styled.div`
    margin-top: 24px;
    > :not(:last-child) {
        margin-bottom: 8px;
    }
`;

const FilMottattFelt = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 600px) {
        flex-direction: row;
        p:first-child {
            padding-right: 0.5rem;
        }
    }
`;

function Vedlegg(props: VedleggProps) {
    const {
        innsendingsId,
        vedlegg,
        setOpplastingStatus,
        slettAnnetVedlegg,
        oppdaterLokalOpplastingStatus,
    } = props;

    const { t } = useTranslation();

    const [filListe, dispatch] = useReducer(
        filListeReducer,
        initialState,
    );
    const [endrer, setEndrer] = useState(false);
    const [tittel, setTittel] = useState(vedlegg.label);
    const { showError } = useErrorMessage();

    const erAnnetVedlegg =
        vedlegg.vedleggsnr?.toUpperCase() === 'N6' &&
        !vedlegg.erPakrevd;
    const erSendtInnTidligere = vedlegg.innsendtdato !== null;
    const skjulFiler =
        vedlegg.opplastingsStatus === 'SendSenere' ||
        vedlegg.opplastingsStatus === 'SendesAvAndre';

    const manglerFilTekst = () => {
        if (vedlegg.erHoveddokument)
            return t('soknad.hovedSkjema.feilmelding.manglerFil', {
                label: vedlegg.label,
            });
        if (erAnnetVedlegg)
            return t('soknad.vedlegg.annet.feilmelding.manglerFil', {
                label: vedlegg.label,
            });
        return t('soknad.vedlegg.feilmelding.manglerFil', {
            label: vedlegg.label,
        });
    };

    const feilId = `vedlegg-feil-${vedlegg.id}`;

    const [visFeil, valideringsMelding] = useValidation({
        komponentId: feilId,
        melding: manglerFilTekst(),
        harFeil:
            !filListe.length &&
            vedlegg.opplastingsStatus === 'IkkeValgt' &&
            !endrer,
    });

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
                    showError(error);
                });
        }

        return () =>
            dispatch({
                type: ACTIONS.RESET_LISTE,
            });
    }, [innsendingsId, vedlegg.id, showError]);

    const getFilvelgerButtonText = () => {
        if (vedlegg.erHoveddokument) {
            return t('soknad.hovedSkjema.filvelgerKnapp');
        }
        if (erSendtInnTidligere) {
            return t('soknad.vedlegg.ettersendingFilvelgerKnapp');
        }
        return null; // default text
    };

    return (
        <VedleggContainer $extraMargin={vedlegg.erHoveddokument}>
            <ValideringsRamme
                id={feilId}
                visFeil={visFeil}
                melding={valideringsMelding}
            >
                {endrer ? (
                    <EndreVedlegg
                        tittel={tittel}
                        vedlegg={vedlegg}
                        innsendingsId={innsendingsId}
                        setEndrer={setEndrer}
                        setTittel={setTittel}
                    />
                ) : (
                    <VedleggPanel>
                        <div>
                            <div>
                                {(vedlegg.erHoveddokument ||
                                    !vedlegg.skjemaurl) && (
                                    <Heading
                                        level={'3'}
                                        size="small"
                                        spacing
                                    >
                                        {tittel}
                                    </Heading>
                                )}
                            </div>
                            <div>
                                {!vedlegg.erHoveddokument &&
                                    vedlegg.skjemaurl && (
                                        <Heading
                                            level={'3'}
                                            size="small"
                                            spacing
                                        >
                                            <NavLink
                                                target="_blank"
                                                href={
                                                    vedlegg.skjemaurl
                                                }
                                                rel="noopener noreferrer"
                                            >
                                                {t('link.nyFane', {
                                                    tekst: tittel,
                                                })}
                                            </NavLink>
                                        </Heading>
                                    )}
                            </div>

                            {vedlegg.erHoveddokument && (
                                <ListeGruppe>
                                    <BodyShort>
                                        {t(
                                            'soknad.hovedSkjema.listeTittel',
                                        )}
                                    </BodyShort>
                                    <BodyShort as="ol">
                                        {t(
                                            'soknad.hovedSkjema.liste',
                                            {
                                                returnObjects: true,
                                            },
                                        ).map((element, key) => (
                                            <li key={key}>
                                                {element}
                                            </li>
                                        ))}
                                    </BodyShort>
                                </ListeGruppe>
                            )}

                            {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}

                            {vedlegg.beskrivelse && (
                                <VedleggBeskrivelse size="small">
                                    {vedlegg.beskrivelse}
                                </VedleggBeskrivelse>
                            )}
                        </div>

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
                            <SendtInnTidligereGruppe>
                                <Heading
                                    level={'4'}
                                    size="xsmall"
                                    spacing
                                >
                                    {t(
                                        'soknad.vedlegg.tidligereSendtInn',
                                    )}
                                </Heading>
                                <FilePanel border>
                                    <div className="icon">
                                        <FilUploadIcon
                                            filstatus={
                                                FIL_STATUS.TIDLIGERE_LASTET_OPP
                                            }
                                        />
                                    </div>

                                    <BodyShort className="filename">
                                        {vedlegg.label}
                                    </BodyShort>
                                    <div className="hoyreHalvdel">
                                        <FilMottattFelt>
                                            <BodyShort>
                                                {t(
                                                    'soknad.vedlegg.mottatt',
                                                )}
                                            </BodyShort>
                                            <BodyShort>
                                                {new Date(
                                                    vedlegg.innsendtdato,
                                                ).toLocaleString(
                                                    'no',
                                                    {
                                                        dateStyle:
                                                            'short',
                                                    },
                                                )}
                                            </BodyShort>
                                        </FilMottattFelt>
                                    </div>
                                </FilePanel>
                            </SendtInnTidligereGruppe>
                        )}

                        {!skjulFiler && (
                            <VedleggButtons>
                                <Filvelger
                                    buttonText={getFilvelgerButtonText()}
                                    onFileSelected={(fil: File) =>
                                        dispatch({
                                            type: ACTIONS.NY_FIL,
                                            filData: {
                                                lokalFil: fil,
                                            },
                                        })
                                    }
                                />

                                {erAnnetVedlegg &&
                                    !erSendtInnTidligere && (
                                        <>
                                            <Button
                                                onClick={() =>
                                                    setEndrer(true)
                                                }
                                                variant="secondary"
                                            >
                                                {t(
                                                    'soknad.vedlegg.annet.rediger',
                                                )}
                                            </Button>

                                            <Button
                                                onClick={() =>
                                                    slettAnnetVedlegg(
                                                        vedlegg.id,
                                                    )
                                                }
                                                variant="secondary"
                                            >
                                                {t(
                                                    'soknad.vedlegg.annet.slett',
                                                )}
                                            </Button>
                                        </>
                                    )}
                            </VedleggButtons>
                        )}

                        {!skjulFiler && filListe.length > 0 && (
                            <FilListeGruppe>
                                <Heading
                                    level={'4'}
                                    size="xsmall"
                                    spacing
                                >
                                    {t('soknad.vedlegg.sendtInnNaa')}
                                </Heading>
                                {filListe.map((fil) => {
                                    return (
                                        <Fil
                                            key={fil.komponentID}
                                            komponentID={
                                                fil.komponentID
                                            }
                                            vedlegg={vedlegg}
                                            innsendingsId={
                                                innsendingsId
                                            }
                                            lokalFil={fil.lokalFil}
                                            opplastetFil={
                                                fil.opplastetFil
                                            }
                                            filListeDispatch={
                                                dispatch
                                            }
                                            oppdaterLokalOpplastingStatus={
                                                oppdaterLokalOpplastingStatus
                                            }
                                        />
                                    );
                                })}
                            </FilListeGruppe>
                        )}
                    </VedleggPanel>
                )}
            </ValideringsRamme>
        </VedleggContainer>
    );
}
export default Vedlegg;
