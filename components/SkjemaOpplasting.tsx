import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SoknadType, VedleggType } from '../types/types';
import { SideValideringProvider } from './SideValideringProvider';
import { useModalContext } from './SoknadModalProvider';
import Vedlegg from './Vedlegg';
import { ButtonContainer } from './common/ButtonContainer';
import { Linje } from './common/Linje';

const PaddedVedlegg = styled.div`
  > * {
    margin-top: 16px;
  }
`;

export interface SkjemaOpplastingdProps {
  vedlegg: VedleggType;
  soknad: SoknadType;
  oppdaterVisningsSteg: (nr: number) => void;
  laster: boolean;
}

function SkjemaOpplasting(props: SkjemaOpplastingdProps) {
  const { vedlegg, soknad, oppdaterVisningsSteg } = props;

  const { t } = useTranslation();

  const { openSlettSoknadModal } = useModalContext();

  const [side1HarFeil, setSide1HarFeil] = useState(false);
  const [visSide1Feil, setVisSide1Feil] = useState(false);
  const [side1Valideringfokus, setSide1Valideringfokus] = useState(false);

  return (
    <>
      <Heading level={'2'} size="large" spacing>
        {t('soknad.visningsSteg.steg1.tittel')}
      </Heading>
      <Linje />

      <SideValideringProvider
        setHarValideringsfeil={setSide1HarFeil}
        visValideringsfeil={visSide1Feil}
        setVisValideringsfeil={setVisSide1Feil}
        fokus={side1Valideringfokus}
        setFokus={setSide1Valideringfokus}
      >
        <PaddedVedlegg>
          <Vedlegg innsendingsId={soknad.innsendingsId} vedlegg={vedlegg} soknadVisningstype={soknad.visningsType} />
        </PaddedVedlegg>
        <ButtonContainer $reverse>
          <Button
            onClick={() => {
              if (side1HarFeil) {
                setSide1Valideringfokus(true);
                setVisSide1Feil(true);
                return;
              }
              oppdaterVisningsSteg(1);
            }}
            data-cy="nesteStegKnapp"
            icon={<ArrowRightIcon aria-hidden />}
            iconPosition="right"
          >
            {t('soknad.knapper.neste')}
          </Button>
          <Button
            onClick={() => {
              oppdaterVisningsSteg(-1);
            }}
            variant="secondary"
            data-cy="forrigeStegKnapp"
            icon={<ArrowLeftIcon aria-hidden />}
          >
            {t('soknad.knapper.forrige')}
          </Button>
        </ButtonContainer>
        if (!laster){' '}
        {
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
        }
      </SideValideringProvider>
    </>
  );
}
export default SkjemaOpplasting;
