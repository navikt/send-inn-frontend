import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Label,
    BodyShort,
    TextField,
} from '@navikt/ds-react';
import { Download } from '@navikt/ds-icons';
import { setOpplastingStatusType } from './Vedlegg';

type FormValues = {
    filnavn: string | null;
    file: FileList | null;
};

interface FilopplasterProps {
    innsendingsId: string;
    id: number;
    setOpplastingStatus: setOpplastingStatusType;
}

type OpplastetFil = {
    id: string;
    filnavn: string;
};

export function Filopplaster(props: FilopplasterProps) {
    const { innsendingsId, id, setOpplastingStatus } = props;

    const [filListe, setFilListe] = useState<OpplastetFil[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { register, handleSubmit, reset, setValue, control } =
        useForm<FormValues>();

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register('file');
    const watchFile = useWatch({
        control,
        name: 'file',
    });

    const onSubmit: SubmitHandler<FormValues> = useCallback(
        (data) => {
            if (!data.file?.length) {
                console.log('Fil ikke valgt!');
            } else {
                if (!data.filnavn) {
                    data.filnavn = 'Opplastetfil';
                }
                const fil = data.file[0];
                console.log(data);

                const formData = new FormData();
                formData.append('file', fil);

                setIsLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (
                        progressEvent: ProgressEvent,
                    ) => {
                        console.log('start');
                        setProgress(
                            Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total,
                            ),
                        );
                        console.log(
                            Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total,
                            ),
                        );
                    },
                };
                axios
                    .post(
                        `http://localhost:9064/frontend/v1/soknad/${innsendingsId}/vedlegg/${id}/fil`,
                        formData,
                        config,
                    )
                    .then((response) => {
                        //setSoknad(response.data);
                        setFilListe([
                            ...filListe,
                            {
                                id: response.data.id,
                                filnavn: fil.name,
                            },
                        ]);
                        setOpplastingStatus(id, 'LASTET_OPP');
                        console.log({ response: response.data });
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        reset({ filnavn: null });
                        setValue('file', null);
                        setProgress(0);
                        setIsLoading(false);
                        if (fileRef.current) {
                            fileRef.current.value = '';
                        }
                    });
            }
        },
        [
            filListe,
            id,
            innsendingsId,
            reset,
            setOpplastingStatus,
            setValue,
        ],
    );

    useEffect(() => {
        console.log('Fil endret', watchFile);
        if (watchFile) {
            console.log('Starter filopplasting...');
            handleSubmit(onSubmit)();
        }
    }, [watchFile, handleSubmit, onSubmit]);
    return (
        <form>
            <Button
                as="label"
                variant="secondary"
                loading={isLoading}
            >
                <Download />
                Velg dine filer
                <input
                    {...rest}
                    multiple
                    type="file"
                    // TODO?: Støtte for drag&drop. Kan ikke bruke display: none. Eksempel på løsning: https://stackoverflow.com/a/44277812/15886307
                    style={{ display: 'none' }}
                    ref={(e) => {
                        ref(e);
                        fileRef.current = e; // you can still assign to ref
                    }}
                />
            </Button>
            {isLoading && `${progress}%`}
            <TextField
                label="Gi en beskrivende tittel på vedlegget"
                description="Hvis dette er en av flere sider i et dokument, oppgi sidetall av totalt antall sider (eks. Epikrise, side 1 av 5)."
                {...register('filnavn')}
            />
        </form>
    );
}
