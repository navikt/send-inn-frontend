import React, { FC, ReactElement, useEffect, useRef } from 'react';
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
    filnavn: string;
};

/*


GET

	http://localhost:9064/frontend/v1/soknad/f414b0d2-c278-477c-b770-e85c3e35130a/vedlegg/201/fil/


http://localhost:3000/dokumentinnsending/f414b0d2-c278-477c-b770-e85c3e35130a

[{"id":22,"vedleggsid":201,"filnavn":"2 Feb 2022 at 16-48.pdf","mimetype":"application/pdf","storrelse":255706,"data":null,"opprettetdato":"2022-02-11T14:30:35.233694"}]


*/


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

    const [filListe, setFilListe] = useState<OpplastetFil[]>([]);

    const { register, handleSubmit, reset, setValue } =
        useForm<FormValues>();

/*
    useEffect(() => {
        //const innsendingsId = query.innsendingsId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
        // const innsendingsId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
        //const { brukerid } = data;
        //const { vedleggsIder } = query;
        if (innsendingsId && id ) {

        axios
            .get(`http://localhost:9064/frontend/v1/soknad/${innsendingsId}/vedlegg/${id}/fil/` )
            .then((response) => {
            //setSoknad(response.data);
            //setVedleggsListe(response.data.vedleggsListe);
            //setFilListe(response.data)
            console.log(response.data)

            let nyFilListe : OpplastetFil[] =[]
            // let nyFilListe = response.data.map(x =>  {id: x.id, filnavn: x.filnavn});
            let nyFilListe = OpplastetFil[]
            for (const item in response.data) {
                console.log(item)
                nyFilListe.push(item)
            }
            console.log("Nyfilliste" + nyFilListe)

            setFilListe([
                ...filListe,
                ...nyFilListe
            ]);
        })
        .catch((error) => {
            console.log(error)
        })
    }

}, [innsendingsId, id]);
*/


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
                            filnavn: fil.name,
                        },
                    ]);
                    console.log({ response: response.data });
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    reset({ filnavn: null });
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
                                    {fil.filnavn}
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
