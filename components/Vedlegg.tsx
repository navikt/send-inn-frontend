import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

type FormValues = {
    filnavn: string | null;
    file: FileList | null;
};

type VedleggProps = {
    innsendingsId: string;
    id: number;
    vedleggsnr: string;
    tittel: string;
    uuid: string;
    mimetype: string;
    document: string;
    erHoveddokument: boolean;
    erVariant: boolean;
    erPdfa: boolean;
    skjemaurl: string;
    opplastingsStatus: string;
    opprettetdato: string;
};

type OpplastetFil = {
    id: string;
    filNavn: string;
};

function Vedlegg({
    innsendingsId,
    id,
    vedleggsnr,
    tittel,
    uuid,
    mimetype,
    document,
    erHoveddokument,
    erVariant,
    erPdfa,
    skjemaurl,
    opplastingsStatus,
    opprettetdato,
}: VedleggProps) {
    const [opplastedeFiler, setOpplastedeFiler] =
        useState<FormValues>({
            filnavn: null,
            file: null,
        });

    const [filListe, setFilListe] = useState<OpplastetFil[]>([]);

    const { register, handleSubmit, reset, setValue } =
        useForm<FormValues>();

    function leggTilFil(input: FormValues) {
        setOpplastedeFiler(input);
        console.log({ input });
    }

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register('file');

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!data.file?.length) {
            console.log('last opp fil først!');
        } else {
            if (!data.filnavn) {
                data.filnavn = 'Opplastetfil';
            }
            const fil = data.file[0];
            console.log(data);
            leggTilFil(data);
            console.log({ fil });

            let formData = new FormData();
            formData.append('file', fil);

            axios
                .post(
                    `http://localhost:9064/frontend/v1/soknad/${innsendingsId}/vedlegg/${id}/fil`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                .then((response) => {
                    //setSoknad(response.data);
                    setFilListe([
                        ...filListe,
                        {
                            id: response.data.id,
                            filNavn: fil.name,
                        },
                    ]);
                    console.log({ response: response.data });
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    reset({ filnavn: null });
                    setOpplastedeFiler({
                        filnavn: null,
                        file: null,
                    });
                    setValue('file', null);
                    if (fileRef.current) {
                        fileRef.current.value = '';
                    }
                });
        }
    };
    return (
        <>
            <div>
                {skjemaurl && (
                    <a target="_blank" style={{ color: 'blue' }} href={skjemaurl} rel="noopener noreferrer">
                        Åpne skjema
                    </a>

                )}
            </div>
            <div>
                {vedleggsnr}:  {tittel}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <br />
                Beskriv vedlegg:
                <input {...register('filnavn')} />
                <br />
                <input
                    {...rest}
                    type="file"
                    ref={(e) => {
                        ref(e);
                        fileRef.current = e; // you can still assign to ref
                    }}
                />
                <br />
                <input type="submit" />
            </form>
            {filListe.length > 0 && (
                <div>
                    <span>Dokumenter du har lastet opp nå:</span>

                    {filListe.map((fil) => {
                        return (
                            <div key={fil.id}>
                                <a
                                    target="_blank"
                                    style={{ color: 'blue' }}
                                    href={`http://localhost:9064/frontend/v1/soknad/${innsendingsId}/vedlegg/${id}/fil/${fil.id}`}
                                    rel="noreferrer"
                                >
                                    {fil.filNavn}
                                </a>
                            </div>
                        );
                    })}
                    <br />
                </div>
            )}
        </>
    );
}
export default Vedlegg;
