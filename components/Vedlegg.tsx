import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

type FormValues = {
    filnavn: string | null;
    file: File | null;
};

/*

   {
      "id": 13,
      "vedleggsnr": "W1",
      "tittel": "Dokumentasjon på mottatt bidrag",
      "uuid": "6a2b67d2-b6aa-45bd-874b-7efaf9876f66",
      "mimetype": null,
      "document": null,
      "erHoveddokument": false,
      "erVariant": false,
      "erPdfa": false,
      "skjemaurl": null,
      "opplastingsStatus": "IKKE_VALGT",
      "opprettetdato": "2022-01-19T13:35:51.091965"
    }
 */
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
/*
let props = {
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
}
*/
/*
const Vedlegg: FC<VedleggProps> = (
    propexample
): ReactElement => {
    return <div> {props.vedleggsnr}</div>;

};
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
    const [opplastetFil, setOpplastetFil] = useState<FormValues>({
        filnavn: null,
        file: null,
    });

    const { register, handleSubmit, reset, setValue } =
        useForm<FormValues>();

    function leggTilFil(input: FormValues) {
        setOpplastetFil(input);
    }

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register('file');

    /*
    const {files : FormValues[], setFiles} = useState([])

    filDto *
object
file *
string($binary)

    */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!data.file) {
            console.log('last opp fil først!');
        } else {
            if (!data.filnavn) {
                data.filnavn = 'Opplastetfil';
            }
            console.log(data);
            leggTilFil(data);
            console.log(data);

            let formData = new FormData();
            formData.append('filDto', 'sdfsdf');
            formData.append('file', data.file[0]);

            axios
                .post(
                    `http://localhost:9064/frontend/soknad/${innsendingsId}/vedlegg/${id}/fil`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                .then((response) => {
                    //setSoknad(response.data);
                    console.log({ response: response.data });
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    reset({ filnavn: null });
                    setOpplastetFil({
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
                <Link href={skjemaurl}>{skjemaurl}</Link>
            </div>
            <div>
                {' '}
                {vedleggsnr} {opprettetdato}
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
        </>
    );
}
export default Vedlegg;
