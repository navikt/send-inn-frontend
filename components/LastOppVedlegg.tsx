import { Alert, Button, Heading, Ingress } from '@navikt/ds-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VedleggType } from '../types/types';
import { SideValideringProvider } from './SideValideringProvider';
import Vedlegg from './Vedlegg';
import { useVedleggslisteContext } from './VedleggsListe';
import { ButtonContainer } from './common/ButtonContainer';

import { useErrorMessage } from '../hooks/useErrorMessage';
import { formatertDato } from '../utils/dato';
import AndreVedlegg from './AndreVedlegg';
import { useLagringsProsessContext } from './LagringsProsessProvider';
import { OpprettAnnetVedlegg } from './OpprettAnnetVedlegg';
import { useModalContext } from './SoknadModalProvider';
import { Linje } from './common/Linje';

const FristForOpplastingInfo = styled(Alert)`
  border: 0;
  border-bottom: 1px solid var(--a-border-strong);
  padding-bottom: 4px;
  border-radius: 0px;
  margin-bottom: 24px;
  text-transform: uppercase;
`;
const PaddedVedlegg = styled.div`
  > * {
    margin-top: 16px;
  }
`;

export interface LastOppVedleggdProps {
  vedleggsliste: VedleggType[];
  oppdaterVisningsSteg: (nr: number) => void;
}

function LastOppVedlegg(props: LastOppVedleggdProps) {
  const { vedleggsliste, oppdaterVisningsSteg } = props;

  const { t } = useTranslation();

  const { soknad, soknadKlar, soknadDelvisKlar } = useVedleggslisteContext();
  const {
    openForstettSenereSoknadModal,
    openSendInnKomplettSoknadModal,
    openSendInnUferdigSoknadModal,
    openSlettSoknadModal,
  } = useModalContext();
  const { ventPaaLagring } = useLagringsProsessContext();

  const [lastOppVedleggHarFeil, setLastOppVedleggHarFeil] = useState(false);
  const [visLastOppVedleggFeil, setVisLastOppVedleggFeil] = useState(false);
  const [lastOppVedleggValideringfokus, setLastOppVedleggValideringfokus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { customErrorMessage } = useErrorMessage();

  return (
    <>
      <Heading level={'2'} size="large" spacing>
        {t('soknad.visningsSteg.lastOppVedlegg.tittel')}
      </Heading>
      <Ingress spacing>{t('soknad.visningsSteg.lastOppVedlegg.ingress')}</Ingress>

      {soknad.visningsType === 'ettersending' ? (
        <FristForOpplastingInfo variant="info" inline={true} size="small">
          {t('soknad.visningsSteg.lastOppVedlegg.infoFrist', {
            dato: formatertDato(new Date(soknad.innsendingsFristDato)),
          })}
        </FristForOpplastingInfo>
      ) : (
        <Linje />
      )}
      <SideValideringProvider
        setHarValideringsfeil={setLastOppVedleggHarFeil}
        visValideringsfeil={visLastOppVedleggFeil}
        setVisValideringsfeil={setVisLastOppVedleggFeil}
        fokus={lastOppVedleggValideringfokus}
        setFokus={setLastOppVedleggValideringfokus}
      >
        {soknad.visningsType === 'dokumentinnsending' &&
          soknad.visningsType === 'dokumentinnsending' &&
          vedleggsliste.some((element) => {
            return element.erHoveddokument === true && element.opplastingsStatus !== 'LastetOpp';
          }) && (
            <Alert variant="warning" size="medium">
              {t('soknad.visningsSteg.lastOppVedlegg.advarselHovedskjema')}
            </Alert>
          )}

        <PaddedVedlegg>
          {vedleggsliste
            .filter((x) => !x.erHoveddokument && x.opplastingsStatus !== 'LastetOppIkkeRelevantLenger')
            .map((vedlegg) => {
              return <Vedlegg key={vedlegg.id} innsendingsId={soknad.innsendingsId} vedlegg={vedlegg} />;
            })}

          {soknad.kanLasteOppAnnet && <OpprettAnnetVedlegg innsendingsId={soknad.innsendingsId} />}
        </PaddedVedlegg>
      </SideValideringProvider>

      {vedleggsliste.filter((x) => x.opplastingsStatus === 'LastetOppIkkeRelevantLenger').length > 0 && (
        <AndreVedlegg vedleggsliste={vedleggsliste}></AndreVedlegg>
      )}

      <ButtonContainer>
        <Button
          loading={isLoading}
          onClick={() => {
            if (lastOppVedleggHarFeil) {
              setLastOppVedleggValideringfokus(true);
              setVisLastOppVedleggFeil(true);
              return;
            }
            setIsLoading(true);
            ventPaaLagring()
              .then(() => {
                if (soknadKlar) {
                  openSendInnKomplettSoknadModal();
                } else if (soknadDelvisKlar) {
                  openSendInnUferdigSoknadModal();
                } else {
                  customErrorMessage({
                    message: t('feil.manglerHovedskjema'),
                  });
                }
              })
              .catch(() => console.error('Feil oppsto ved lagring, så kan ikke starte innsending'))
              .finally(() => {
                setIsLoading(false);
              });
          }}
          id="sendTilNAVKnapp"
          data-cy="sendTilNAVKnapp"
        >
          {t('soknad.knapper.sendInn')}
        </Button>

        {/* lagre og fortsett senere */}
        <Button
          variant="secondary"
          onClick={() => {
            openForstettSenereSoknadModal();
          }}
        >
          {t('soknad.knapper.fortsettSenere')}
        </Button>

        {/* gå tilbake et steg */}
        {soknad.visningsType === 'dokumentinnsending' && (
          <Button
            onClick={() => {
              oppdaterVisningsSteg(-1);
            }}
            variant="secondary"
            data-cy="forrigeStegKnapp"
          >
            {t('soknad.knapper.forrige')}
          </Button>
        )}

        {soknad.visningsType === 'fyllUt' && soknad.skjemaPath && (
          <Button
            onClick={() => {
              location.assign(
                `${process.env.NEXT_PUBLIC_FYLLUT_URL}/${soknad.skjemaPath}/oppsummering?sub=digital&innsendingsId=${soknad.innsendingsId}`,
              );
            }}
            variant="secondary"
            data-cy="forrigeStegKnapp"
          >
            {t('soknad.knapper.forrige')}
          </Button>
        )}
        <Button
          onClick={() => {
            openSlettSoknadModal();
          }}
          variant="tertiary"
          data-cy="slettSoknadKnapp"
        >
          {t('soknad.knapper.slett')}
        </Button>
      </ButtonContainer>
      {/* end */}
    </>
  );
}
export default LastOppVedlegg;
