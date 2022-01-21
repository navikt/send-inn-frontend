import React, { FC, ReactElement } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';

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
    id: number,
    vedleggsnr: string,
    tittel: string,
    uuid: string,
    mimetype: string,
    document: string,
    erHoveddokument: boolean,
    erVariant: boolean,
    erPdfa: boolean,
    skjemaurl: string,
    opplastingsStatus: string,
    opprettetdato: string,
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

function Vedlegg({   id,
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
                     opprettetdato,}:VedleggProps){
    const [opplastetFil , setOpplastetFil] = useState<FormValues>({
        filnavn: null,
        file: null
    });

    function leggTilFil(input : FormValues) {
        setOpplastetFil(input)
    }

    React.useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({ something: '' });
        }
    }, [formState, submittedData, reset]);

    
    const { register, handleSubmit } = useForm<FormValues>();
    /*
    const {files : FormValues[], setFiles} = useState([])
    */
    const onSubmit: SubmitHandler<FormValues> = data => {
        if(opplastetFil.file) {
            console.log("last opp fil først!")
        } else {
            if(!data.filnavn) {
                data.filnavn="Opplastetfil"
            }
        console.log(data);
        leggTilFil(data);
        console.log(data);
        setOpplastetFil({
                filnavn: null,
                    file: null
            });
        }
    }
    return <>
        <div>
            <Link href={skjemaurl} >
                {skjemaurl}
            </Link>
        </div>
        <div> {vedleggsnr} {opprettetdato}</div>
        <form onSubmit={handleSubmit(onSubmit)}><br/>
            Beskriv vedlegg:<input {...register("filnavn")} /><br/>
            <input type="file" {...register("file")} /><br/>

            <input type="submit" />
        </form>
    </>;

}
export default Vedlegg;