import { Textarea } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';
import { useValidation } from '../hooks/useValidation';

const MAKS_LENGDE = 200;

interface VedleggsKommentarProp {
  vedleggsId: number;
  label: string;
  description?: string;
  kommentar: string;
  setKommentar: (text: string) => void;
  oppdaterKommentar: (kommentar: string) => void;
  avbrytOppdatering: () => void;
}

export function VedleggsKommentar({
  label,
  description,
  kommentar,
  setKommentar,
  oppdaterKommentar,
  vedleggsId,
  avbrytOppdatering,
}: VedleggsKommentarProp) {
  const { t } = useTranslation();

  const [lokalKommentar, setLokalKommentar] = useState(kommentar);

  const komponentId = 'VedleggsKommentar_' + vedleggsId;

  const harValideringsFeil = (text: string) => {
    if (!text) {
      return t('feil.paakrevd', { felt: label });
    }
    if (text.length > MAKS_LENGDE) {
      return t('feil.maksLengde', { felt: label, maksLengde: MAKS_LENGDE });
    }
  };

  const valideringsFeil = harValideringsFeil(lokalKommentar);

  const [visFeil] = useValidation({
    komponentId,
    melding: valideringsFeil || '',
    harFeil: !!valideringsFeil,
  });

  const debounced = useDebouncedCallback((nyKommentar: string) => {
    oppdaterKommentar(nyKommentar);
  }, 500);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setLokalKommentar(value);
    if (!value || !harValideringsFeil(value)) {
      avbrytOppdatering();
      setKommentar(value);
      debounced(value);
    }
  };

  useEffect(
    () => () => {
      debounced.cancel();
    },
    [debounced],
  );

  return (
    <Textarea
      id={komponentId}
      value={lokalKommentar}
      label={label}
      description={description}
      maxLength={200}
      i18n={{
        counterLeft: t('textarea.counterLeft'),
        counterTooMuch: t('textarea.counterTooMuch'),
      }}
      onChange={onChange}
      onBlur={() => {
        debounced.flush();
      }}
      error={visFeil && valideringsFeil}
      data-cy="VedleggsKommentar"
    />
  );
}
