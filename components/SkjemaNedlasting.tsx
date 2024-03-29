import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import { ButtonContainer } from './common/ButtonContainer';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import { VedleggType } from '../types/types';
import { useModalContext } from './SoknadModalProvider';
import { VedleggContainer, VedleggPanel } from './Vedlegg';
import { LastNedKnapp } from './common/LastNedKnapp';
import { Linje } from './common/Linje';

const BeskrivelsesGruppe = styled.div`
  padding-bottom: 1.5rem;
  @media only screen and (max-width: 600px) {
    ol {
      padding-left: 1.5rem;
    }
  }
`;

export interface SkjemanedlastingdProps {
  vedlegg: VedleggType;
  oppdaterVisningsSteg: (nr: number) => void;
}

function SkjemaNedlasting(props: SkjemanedlastingdProps) {
  const { vedlegg, oppdaterVisningsSteg } = props;

  const { t } = useTranslation();
  const { openSlettSoknadModal } = useModalContext();

  return (
    <>
      <Heading level={'2'} size="large" spacing>
        {t('soknad.visningsSteg.steg0.tittel')}
      </Heading>
      <Linje />
      <VedleggContainer $extraMargin>
        <VedleggPanel $extraMargin>
          <Heading level={'3'} size="small" spacing>
            {vedlegg.label}
          </Heading>
          <BeskrivelsesGruppe>
            <BodyShort>{t('soknad.skjemaNedlasting.listeTittel')}</BodyShort>
            <BodyShort as="ol">
              {(
                t('soknad.skjemaNedlasting.liste', {
                  returnObjects: true,
                }) as string[]
              ).map((element, key) => (
                <li key={key}>{element}</li>
              ))}
            </BodyShort>
          </BeskrivelsesGruppe>

          {vedlegg.skjemaurl && (
            <LastNedKnapp url={vedlegg.skjemaurl}>{t('soknad.skjemaNedlasting.lastNedKnapp')}</LastNedKnapp>
          )}
        </VedleggPanel>
      </VedleggContainer>

      <ButtonContainer>
        <Button
          onClick={() => {
            oppdaterVisningsSteg(1);
          }}
          data-cy="nesteStegKnapp"
          icon={<ArrowRightIcon />}
          iconPosition="right"
        >
          {t('soknad.knapper.neste')}
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        <Button
          onClick={() => {
            openSlettSoknadModal();
          }}
          variant="tertiary"
          data-cy="slettSoknadKnapp"
        >
          {t('soknad.knapper.avbryt')}
        </Button>
      </ButtonContainer>
    </>
  );
}
export default SkjemaNedlasting;
