import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField, Panel } from '@navikt/ds-react';
import { Add } from '@navikt/ds-icons';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggPanel } from './Vedlegg';

const { publicRuntimeConfig } = getConfig();

const ButtomRow = styled.div`
    margin-top: 24px;
`;

export interface EndreVedleggProps {
    innsendingsId: string;
    leggTilVedlegg: (arg: string) => void;
}

type FormValues = {
    tittel: string;
};

export function OpprettAnnetVedlegg({
    innsendingsId,
    leggTilVedlegg,
}: EndreVedleggProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [visOpprett, setVisOpprett] = useState(false);
    const { register, handleSubmit, reset } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);

        setIsLoading(true);

        axios
            .post(
                `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}/vedlegg`,
                {
                    tittel: data.tittel,
                },
            )
            .then((response) => {
                leggTilVedlegg(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
                setVisOpprett(false);
                reset();
            });
    };

    return (
        <>
            {visOpprett && (
                <VedleggPanel>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            autoFocus
                            label={t('soknad.vedlegg.annet.tittel')}
                            description={t(
                                'soknad.vedlegg.annet.beskrivelse',
                            )}
                            {...register('tittel', {
                                required: true,
                            })}
                            defaultValue=""
                        />
                        <ButtomRow>
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
                                onClick={() => setVisOpprett(false)}
                            >
                                {t('soknad.vedlegg.annet.avbryt')}
                            </Button>
                        </ButtomRow>
                    </form>
                </VedleggPanel>
            )}
            {!visOpprett && (
                <Button
                    onClick={() => setVisOpprett(true)}
                    variant="secondary"
                    icon={<Add />}
                >
                    {t('soknad.knapper.annenVedleggKnapp')}
                </Button>
            )}
        </>
    );
}
