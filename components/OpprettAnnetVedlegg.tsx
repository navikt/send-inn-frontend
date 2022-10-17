import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { Heading, Button, TextField, Panel } from '@navikt/ds-react';
import { Add } from '@navikt/ds-icons';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { VedleggPanel } from './Vedlegg';
import { useValidation } from '../hooks/useValidation';
import { ValideringsRamme } from './ValideringsRamme';

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
        melding: t(
            'soknad.vedlegg.annet.feilmelding.fullforOpprettelse',
        ),
        harFeil: !harVailderingfeil && visOpprett,
    });

    useValidation({
        komponentId: feilId + '-validering',
        melding: errors.tittel?.message,
        harFeil: harVailderingfeil && visOpprett,
    });

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
                showError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setVisOpprett(false);
                reset();
            });
    };
    const maxLength = 250;

    return (
        <>
            {visOpprett && (
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
                                label={t(
                                    'soknad.vedlegg.annet.tittel',
                                )}
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
                                defaultValue=""
                                error={errors.tittel?.message}
                            />
                            <ButtomRow>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    loading={isLoading}
                                >
                                    {t(
                                        'soknad.vedlegg.annet.bekreft',
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    disabled={isLoading}
                                    onClick={() =>
                                        setVisOpprett(false)
                                    }
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
