import { BodyLong } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVedleggslisteContext } from './VedleggsListe';

export const AutomatiskInnsending = () => {
  const { onSendInn } = useVedleggslisteContext();
  const { t } = useTranslation();
  const [skalSendeInn, setSkalSendeInn] = useState(true);

  useEffect(() => {
    if (skalSendeInn) {
      setSkalSendeInn(false);
      onSendInn();
    }
  }, [onSendInn, skalSendeInn]);

  return <BodyLong>{t('soknad.visningsSteg.fraFyllutUtenVedlegg.laster')}</BodyLong>;
};
