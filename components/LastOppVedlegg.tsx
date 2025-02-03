import { Alert, BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VedleggType } from '../types/types';
import { SideValideringProvider } from './SideValideringProvider';
import Vedlegg from './Vedlegg';
import { useVedleggslisteContext } from './VedleggsListe';
import { ButtonContainer } from './common/ButtonContainer';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { formatertDato } from '../utils/dato';
import { navigerTilFyllut } from '../utils/navigerTilFyllut';
import { isLospost } from '../utils/soknad';
import AndreVedlegg from './AndreVedlegg';
import { useAxiosInterceptorContext } from './AxiosInterceptor';
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
  margin-bottom: var(--a-spacing-10);
`;

const SistLagret = styled(BodyShort)`
  display: flex;
  justify-content: center;
  margin-top: var(--a-spacing-5);
  margin-bottom: var(--a-spacing-5);
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
  const { savedAt } = useAxiosInterceptorContext();

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
      <BodyLong size="large">
        {t(`soknad.visningsSteg.lastOppVedlegg.ingress${isLospost(soknad) ? '-lospost' : ''}`)}
      </BodyLong>

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
            .filter(
              (x) =>
                (!x.erHoveddokument || soknad.visningsType === 'lospost') &&
                x.opplastingsStatus !== 'LastetOppIkkeRelevantLenger',
            )
            .map((vedlegg) => {
              return (
                <Vedlegg
                  key={vedlegg.id}
                  innsendingsId={soknad.innsendingsId}
                  vedlegg={vedlegg}
                  soknadVisningstype={soknad.visningsType}
                />
              );
            })}

          {soknad.kanLasteOppAnnet && <OpprettAnnetVedlegg innsendingsId={soknad.innsendingsId} />}
        </PaddedVedlegg>
      </SideValideringProvider>

      {vedleggsliste.filter((x) => x.opplastingsStatus === 'LastetOppIkkeRelevantLenger').length > 0 && (
        <AndreVedlegg vedleggsliste={vedleggsliste}></AndreVedlegg>
      )}

      <SistLagret>{`${t('soknad.visningsSteg.lastOppVedlegg.sistLagret')}: ${
        savedAt || new Date(soknad.endretDato).toLocaleString()
      }`}</SistLagret>

      <ButtonContainer $reverse>
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

        {/* gå tilbake et steg */}
        {soknad.visningsType === 'dokumentinnsending' && (
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
        )}

        {soknad.visningsType === 'fyllUt' && soknad.skjemaPath && (
          <Button
            onClick={() => {
              navigerTilFyllut(soknad);
            }}
            variant="secondary"
            data-cy="forrigeStegKnapp"
            icon={<ArrowLeftIcon aria-hidden />}
          >
            {t('soknad.knapper.forrige')}
          </Button>
        )}
      </ButtonContainer>
      <ButtonContainer>
        {/* lagre og fortsett senere */}
        <Button
          variant="tertiary"
          onClick={() => {
            openForstettSenereSoknadModal();
          }}
        >
          {t('soknad.knapper.fortsettSenere')}
        </Button>

        <Button
          onClick={() => {
            setIsLoading(true);
            ventPaaLagring()
              .then(() => {
                openSlettSoknadModal();
              })
              .catch(() => console.error('Feil oppsto ved lagring, så kan ikke starte innsending'))
              .finally(() => {
                setIsLoading(false);
              });
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
