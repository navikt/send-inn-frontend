import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField, Panel } from '@navikt/ds-react';
import { Add } from '@navikt/ds-icons';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';
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
                            label="Beskriv vedlegget"
                            description={`Gi et beskrivende navn på dokumentasjonen du ønsker å laste opp.`}
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
                                Bekreft
                            </Button>
                            <Button
                                type="button"
                                variant="tertiary"
                                disabled={isLoading}
                                onClick={() => setVisOpprett(false)}
                            >
                                Avbryt
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
                    Legg til annen dokumentasjon
                </Button>
            )}
        </>
    );
}
