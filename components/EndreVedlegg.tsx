import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField } from '@navikt/ds-react';
import { VedleggType } from '../types/types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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
            <Heading size="small" spacing>
                Annen dokumentasjon (valgfritt)
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    defaultValue={tittel}
                    label="Gi en beskrivende tittel på vedlegget"
                    description={`Skriv inn hva du ønsker å laste opp (f.eks. “kopi av
                førerkort”, “epikrise”, “faktura som dokumenterer
                utgifter i forbindelse med ...”). Du kan laste opp
                flere filer hvis du har skannet eller tatt bilde av
                hver side av et dokument med mange sider.`}
                    {...register('tittel', { required: true })}
                />
                <Button
                    type="submit"
                    variant="secondary"
                    loading={isLoading}
                >
                    Bekreft
                </Button>
            </form>
        </div>
    );
}
