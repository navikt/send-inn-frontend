import { PlusIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import axios from 'axios';
import getConfig from 'next/config';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useValidation } from '../hooks/useValidation';
import { ValideringsRamme } from './ValideringsRamme';
import { VedleggPanel } from './Vedlegg';
import { useVedleggslisteContext } from './VedleggsListe';

const { publicRuntimeConfig } = getConfig();

const ButtomRow = styled.div`
  margin-top: 24px;
`;

export interface EndreVedleggProps {
  innsendingsId: string;
}

type FormValues = {
  tittel: string;
};

export function OpprettAnnetVedlegg({ innsendingsId }: EndreVedleggProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [visOpprett, setVisOpprett] = useState(false);
  const [giFokusPaaLeggTil, setGiFokusPaaLeggTil] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const { showError } = useErrorMessage();

  const feilId = 'opprett-vedlegg-feil';
  const harVailderingfeil = errors.tittel?.message != undefined;

  const [visFeil, valideringsMelding] = useValidation({
    komponentId: feilId,
    melding: t('soknad.vedlegg.annet.feilmelding.fullforOpprettelse'),
    harFeil: !harVailderingfeil && visOpprett,
  });

  const { leggTilVedlegg } = useVedleggslisteContext();

  useValidation({
    komponentId: feilId + '-validering',
    melding: errors.tittel?.message || '',
    harFeil: harVailderingfeil && visOpprett,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);

    axios
      .post(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg`, {
        tittel: data.tittel,
      })
      .then((response) => {
        leggTilVedlegg({ ...response.data, autoFocus: true });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        setIsLoading(false);
        setGiFokusPaaLeggTil(false);
        setVisOpprett(false);
        reset();
      });
  };
  const maxLength = 250;

  return (
    <>
      {visOpprett && (
        <ValideringsRamme id={feilId} visFeil={visFeil} melding={valideringsMelding}>
          <VedleggPanel data-cy="opprettAnnetVedleggPanel">
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                id={feilId + '-validering'}
                autoFocus
                label={t('soknad.vedlegg.annet.tittel')}
                description={t('soknad.vedlegg.annet.beskrivelse')}
                {...register('tittel', {
                  required: {
                    value: true,
                    message: t('soknad.vedlegg.annet.feilmelding.manglerNavn'),
                  },
                  maxLength: {
                    value: maxLength,
                    message: t('soknad.vedlegg.annet.feilmelding.navnForLangt', { maxLength }),
                  },
                })}
                defaultValue=""
                error={errors.tittel?.message}
              />
              <ButtomRow>
                <Button type="submit" variant="secondary" loading={isLoading}>
                  {t('soknad.vedlegg.annet.bekreft')}
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  disabled={isLoading}
                  onClick={() => {
                    setVisOpprett(false);
                    setGiFokusPaaLeggTil(true);
                  }}
                >
                  {t('soknad.vedlegg.annet.avbryt')}
                </Button>
              </ButtomRow>
            </form>
          </VedleggPanel>
        </ValideringsRamme>
      )}
      {!visOpprett && (
        <Button
          data-cy="opprettAnnetVedlegg"
          onClick={() => setVisOpprett(true)}
          variant="secondary"
          icon={<PlusIcon aria-hidden />}
          autoFocus={giFokusPaaLeggTil}
        >
          {t('soknad.knapper.annenVedleggKnapp')}
        </Button>
      )}
    </>
  );
}
