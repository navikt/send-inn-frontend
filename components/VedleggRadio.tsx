import { Radio, RadioGroup } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';
import { OpplastingsStatus, VedleggsValgAlternativ, VedleggsvalgType } from '../types/types';
import { mapVedleggsvalgToOpplastingStatus } from '../utils/vedleggsValgUtils';
import { ScreenReaderOnly } from './textStyle';

interface VedleggRadioProp {
  label: string;
  harOpplastetFil: boolean;
  vedleggsvalg: VedleggsvalgType;
  valgAlternativer: VedleggsValgAlternativ[];
  oppdaterOpplastingStatus: (status: OpplastingsStatus) => void;
  setValgtOpplastingStatus: (status: OpplastingsStatus) => void;
  avbrytOppdatering: () => void;
}

function VedleggRadio({
  label,
  harOpplastetFil,
  valgAlternativer,
  vedleggsvalg,
  oppdaterOpplastingStatus,
  avbrytOppdatering,
  setValgtOpplastingStatus,
}: VedleggRadioProp) {
  const { t } = useTranslation();

  const debounced = useDebouncedCallback(
    (debouncedLokalOpplastingsStatus: OpplastingsStatus) => {
      oppdaterOpplastingStatus(debouncedLokalOpplastingsStatus);
    },
    500,
    { leading: true },
  );

  const handleChange = (val: VedleggsvalgType) => {
    avbrytOppdatering();
    const nyOpplastingStatus = mapVedleggsvalgToOpplastingStatus(val, harOpplastetFil);
    debounced(nyOpplastingStatus);
    setValgtOpplastingStatus(nyOpplastingStatus);
  };

  return (
    <RadioGroup
      legend={
        <>
          {t('soknad.vedlegg.radio.tittel')}
          <ScreenReaderOnly>
            {t('for')} {label}
          </ScreenReaderOnly>
        </>
      }
      size="medium"
      onChange={(val: VedleggsvalgType) => handleChange(val)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Trigger når radioGroup mister fokus
          debounced.flush();
        }
      }}
      value={vedleggsvalg}
    >
      {valgAlternativer.map(({ key, dataCy, translationKey }) => (
        <Radio value={key} data-cy={dataCy} key={key}>
          {t(translationKey)}
        </Radio>
      ))}
    </RadioGroup>
  );
}

export default VedleggRadio;
