import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField } from '@navikt/ds-react';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
    const { register, handleSubmit } = useForm<FormValues>();

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
                setTittel(data.tittel);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
                setEndrer(false);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    defaultValue={tittel}
                    label={t('soknad.vedlegg.annet.tittel')}
                    description={t(
                        'soknad.vedlegg.annet.beskrivelse',
                    )}
                    {...register('tittel', { required: true })}
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
        </div>
    );
}
