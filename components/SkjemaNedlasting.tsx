import React, { useEffect, useReducer } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {
    Panel,
    Heading,
    Link as NavLink,
    Ingress,
    BodyLong,
    Button,
} from '@navikt/ds-react';
import { Filvelger } from './Filvelger';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Download } from '@navikt/ds-icons';

import {
    setOpplastingStatusType,
    OpplastetFil,
    VedleggType,
} from '../types/types';
import { EndreVedlegg } from './EndreVedlegg';
import { Fil } from './Fil';

export interface VedleggProps {
    vedlegg: VedleggType | null;
    innsendingsId: string;
    setOpplastingStatus: setOpplastingStatusType;
    erAnnetVedlegg?: boolean;
}

const VedleggPanel = styled(Panel)`
    background-color: var(--navds-semantic-color-canvas-background);
`;

function SkjemaNedlasting(props: VedleggProps) {
    const {
        innsendingsId,
        vedlegg,
        setOpplastingStatus,
        erAnnetVedlegg = true,
    } = props;

    return (
        <div>
            <VedleggPanel>
                <Heading size="small" spacing>
                    {vedlegg.vedleggsnr}: {vedlegg.label}
                </Heading>
                <div>
                    <BodyLong>
                        <Ingress>slik gjør du:</Ingress>

                        <ol>
                            <li>Klikk på “Last ned skjema”. </li>
                            <li>
                                Åpne og fyll ut pdf-skjemaet som
                                lastes ned.{' '}
                            </li>
                            <li>
                                Lagre skjemaet på enheten din etter
                                utfylling.
                            </li>
                            <li>Klikk på “Gå videre”.</li>
                        </ol>
                    </BodyLong>
                </div>
                {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}
                {vedlegg.beskrivelse && (
                    <div>{vedlegg.beskrivelse}</div>
                )}

                <div>
                    {vedlegg.skjemaurl && (
                        <Button
                            as="a"
                            variant="secondary"
                            target="_blank"
                            href={vedlegg.skjemaurl}
                            rel="noopener noreferrer"
                        >
                            <Download />
                            Last ned skjema
                        </Button>
                    )}
                </div>

                <br />
            </VedleggPanel>
        </div>
    );
}
export default SkjemaNedlasting;
