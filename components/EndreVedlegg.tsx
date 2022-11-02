import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Button, TextField } from '@navikt/ds-react';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useValidation } from '../hooks/useValidation';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { VedleggPanel } from './Vedlegg';
import { ValideringsRamme } from './ValideringsRamme';

const { publicRuntimeConfig } = getConfig();

const ButtonRow = styled.div`
    margin-top: 24px;
`;

export interface EndreVedleggProps {
    tittel: string;
    setEndrer: (arg: boolean) => void;
    vedlegg: VedleggType;
    innsendingsId: string;
    setTittel: (arg: string) => void;
}

type FormValues = {
    tittel: string;
};

export function EndreVedlegg({
    tittel,
    setEndrer,
    vedlegg,
    innsendingsId,
    setTittel,
}: EndreVedleggProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const { showError } = useErrorMessage();

    const feilId = `vedlegg-endrer-feil-${vedlegg.id}`;

    const harVailderingfeil = errors.tittel?.message != undefined;

    const [visFeil, valideringsMelding] = useValidation({
        komponentId: feilId,
        melding: t(
            'soknad.vedlegg.annet.feilmelding.fullforRedigering',
        ),
        harFeil: !harVailderingfeil,
    });

    useValidation({
        komponentId: feilId + '-validering',
        melding: errors.tittel?.message,
        harFeil: harVailderingfeil,
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);

        setIsLoading(true);

        axios
            .patch(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg/${vedlegg.id}`,
                {
                    tittel: data.tittel,
                },
            )
            .then((response) => {
                // todo response.data.tittel?
                setTittel(data.tittel);
            })
            .catch((error) => {
                showError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setEndrer(false);
            });
    };
    const maxLength = 250;

    return (
        <ValideringsRamme
            id={feilId}
            visFeil={visFeil}
            melding={valideringsMelding}
        >
            <VedleggPanel>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id={feilId + '-validering'}
                        autoFocus
                        defaultValue={tittel}
                        label={t('soknad.vedlegg.annet.tittel')}
                        description={t(
                            'soknad.vedlegg.annet.beskrivelse',
                        )}
                        {...register('tittel', {
                            required: {
                                value: true,
                                message: t(
                                    'soknad.vedlegg.annet.feilmelding.manglerNavn',
                                ),
                            },
                            maxLength: {
                                value: maxLength,
                                message: t(
                                    'soknad.vedlegg.annet.feilmelding.navnForLangt',
                                    { maxLength },
                                ),
                            },
                        })}
                        error={errors.tittel?.message}
                    />
                    <ButtonRow>
                        <Button
                            type="submit"
                            variant="secondary"
                            loading={isLoading}
                        >
                            {t('soknad.vedlegg.annet.bekreft')}
                        </Button>
                        <Button
                            type="button"
                            variant="tertiary"
                            disabled={isLoading}
                            onClick={() => setEndrer(false)}
                        >
                            {t('soknad.vedlegg.annet.avbryt')}
                        </Button>
                    </ButtonRow>
                </form>
            </VedleggPanel>
        </ValideringsRamme>
    );
}
