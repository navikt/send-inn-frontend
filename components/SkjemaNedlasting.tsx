import React from 'react';
import { Heading, Button, BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { Download } from '@navikt/ds-icons';
import { useTranslation } from 'react-i18next';

import { setOpplastingStatusType, VedleggType } from '../types/types';
import { VedleggPanel } from './Vedlegg';

const BeskrivelsesGruppe = styled.div`
    padding-bottom: 1.5rem;
    @media only screen and (max-width: 600px) {
        ol {
            padding-left: 1.5rem;
        }
    }
`;

export interface VedleggProps {
    vedlegg: VedleggType | null;
    innsendingsId: string;
    setOpplastingStatus: setOpplastingStatusType;
    erAnnetVedlegg?: boolean;
}

function SkjemaNedlasting(props: VedleggProps) {
    const { vedlegg } = props;

    const { t } = useTranslation();

    return (
        <div>
            <VedleggPanel $extraMargin>
                <Heading level={'3'} size="small" spacing>
                    {vedlegg.label}
                </Heading>
                <BeskrivelsesGruppe>
                    <BodyShort>
                        {t('soknad.skjemaNedlasting.listeTittel')}
                    </BodyShort>
                    {/* TODO: husk styling på <ol> */}
                    <BodyShort as="ol">
                        {t('soknad.skjemaNedlasting.liste', {
                            returnObjects: true,
                        }).map((element, key) => (
                            <li key={key}>{element}</li>
                        ))}
                    </BodyShort>

                    {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}
                    {vedlegg.beskrivelse && (
                        <BodyShort>{vedlegg.beskrivelse}</BodyShort>
                    )}
                </BeskrivelsesGruppe>

                <div>
                    {vedlegg.skjemaurl && (
                        <Button
                            as="a"
                            variant="secondary"
                            target="_blank"
                            href={vedlegg.skjemaurl}
                            rel="noopener noreferrer"
                            icon={<Download />}
                            data-cy="lastNedKnapp"
                        >
                            {t(
                                'soknad.skjemaNedlasting.lastNedKnapp',
                            )}
                        </Button>
                    )}
                </div>
            </VedleggPanel>
        </div>
    );
}
export default SkjemaNedlasting;
