import React, { useContext } from 'react';
import { Heading, Button, BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { Download } from '@navikt/ds-icons';
import { useTranslation } from 'react-i18next';
import { ButtonContainer } from './VedleggsListe';

import { VedleggType } from '../types/types';
import { VedleggPanel } from './Vedlegg';
import { ModalContext } from './ModalContextProvider';

const Linje = styled.div`
    border-bottom: 1px solid var(--navds-semantic-color-border);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;
const BeskrivelsesGruppe = styled.div`
    padding-bottom: 1.5rem;
    @media only screen and (max-width: 600px) {
        ol {
            padding-left: 1.5rem;
        }
    }
`;

export interface SkjemanedlastingdProps {
    vedlegg: VedleggType | null;
    oppdaterVisningsSteg: (nr: number) => void;
    setSlettSoknadModal: (boolean: boolean) => void;
}

function SkjemaNedlasting(props: SkjemanedlastingdProps) {
    const { vedlegg, oppdaterVisningsSteg, setSlettSoknadModal } =
        props;

    const { t } = useTranslation();
    const { openSlettSoknadModal } = useContext(ModalContext);

    return (
        <div>
            <Heading level={'2'} size="large" spacing>
                {t('soknad.visningsSteg.steg0.tittel')}
            </Heading>
            <Linje />
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

            <ButtonContainer>
                <Button
                    onClick={() => {
                        oppdaterVisningsSteg(1);
                    }}
                    data-cy="nesteStegKnapp"
                >
                    {t('soknad.knapper.neste')}
                </Button>

                <Button
                    onClick={() => {
                        //  if (!slettSoknadModal) {
                        openSlettSoknadModal();
                        // }
                    }}
                    variant="tertiary"
                    data-cy="slettSoknadKnapp"
                >
                    {t('soknad.knapper.avbryt')}
                </Button>
            </ButtonContainer>
        </div>
    );
}
export default SkjemaNedlasting;
