import React, { useState } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import axios from 'axios';
import { Heading, Button, TextField } from '@navikt/ds-react';

export interface EndreVedleggProps {
    tittel: string;
    setEndrer: (arg: boolean) => void;
}

type FormValues = {
    tittel: string;
};

export function EndreVedlegg({
    tittel,
    setEndrer,
}: EndreVedleggProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm<FormValues>();

    const onSubmit = (data) => {
        console.log(data);

        setIsLoading(true);
        // TODO: endreTittel-request mot API
        setIsLoading(false);
        setEndrer(false);
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
