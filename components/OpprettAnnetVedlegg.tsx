import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField, Panel } from '@navikt/ds-react';
import { Add } from '@navikt/ds-icons';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';
import styled from 'styled-components';

const { publicRuntimeConfig } = getConfig();

const VedleggPanel = styled(Panel)`
    background-color: var(--navds-semantic-color-canvas-background);
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
                    <Heading size="small" spacing>
                        Annen dokumentasjon (valgfritt)
                    </Heading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            autoFocus
                            label="Gi en beskrivende tittel på vedlegget"
                            description={`Skriv inn hva du ønsker å laste opp (f.eks. “kopi av
                førerkort”, “epikrise”, “faktura som dokumenterer
                utgifter i forbindelse med ...”). Du kan laste opp
                flere filer hvis du har skannet eller tatt bilde av
                hver side av et dokument med mange sider.`}
                            {...register('tittel', {
                                required: true,
                            })}
                            defaultValue=""
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            loading={isLoading}
                        >
                            Bekreft
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isLoading}
                            onClick={() => setVisOpprett(false)}
                        >
                            Avbryt
                        </Button>
                    </form>
                </VedleggPanel>
            )}
            {!visOpprett && (
                <Button
                    onClick={() => setVisOpprett(true)}
                    variant="secondary"
                >
                    <Add />
                    Legg til annen dokumentasjon
                </Button>
            )}
        </>
    );
}
