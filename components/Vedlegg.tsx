import React, {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { Button, Panel } from '@navikt/ds-react';
import { Download } from '@navikt/ds-icons';

type FormValues = {
    filnavn: string | null;
    file: FileList | null;
};

type setOpplastingStatusType = (
    id: number,
    opplastingStatus: string,
) => void;

interface VedleggProps {
    innsendingsId: string;
    id: number;
    vedleggsnr: string;
    tittel: string;
    label: string;
    beskrivelse: string;
    uuid: string;
    mimetype: string;
    document: string;
    erHoveddokument: boolean;
    erVariant: boolean;
    erPdfa: boolean;
    skjemaurl: string;
    opplastingsStatus: string;
    opprettetdato: string;
    setOpplastingStatus: setOpplastingStatusType;
    // (x: string): void;
}

type OpplastetFil = {
    id: string;
    filnavn: string;
};

/*


GET

	http://localhost:9064/frontend/v1/soknad/f414b0d2-c278-477c-b770-e85c3e35130a/vedlegg/201/fil/



http://localhost:3000/dokumentinnsending/f414b0d2-c278-477c-b770-e85c3e35130a

[{"id":22,"vedleggsid":201,"filnavn":"2 Feb 2022 at 16-48.pdf","mimetype":"application/pdf","storrelse":255706,"data":null,"opprettetdato":"2022-02-11T14:30:35.233694"}]

setFilListe([
                        ...filListe,
                        {
                            id: response.data.id,
                            filnavn: fil.name,
                        },
                    ]);

*/

function Vedlegg(props: VedleggProps) {
    const {
        innsendingsId,
        id,
        vedleggsnr,
        tittel,
        label,
        beskrivelse,
        uuid,
        mimetype,
        document,
        erHoveddokument,
        erVariant,
        erPdfa,
        skjemaurl,
        opplastingsStatus,
        opprettetdato,
        setOpplastingStatus,
    } = props;

    const [filListe, setFilListe] = useState<OpplastetFil[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, control } =
        useForm<FormValues>();

    useEffect(() => {
        //const innsendingsId = query.innsendingsId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
        // const innsendingsId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
        //const { brukerid } = data;
        //const { vedleggsIder } = query;
        if (innsendingsId && id) {
            const nyFilListe: OpplastetFil[] = [];
            axios
                .get(
                    `http://localhost:9064/frontend/v1/soknad/${innsendingsId}/vedlegg/${id}/fil/`,
                )
                .then((response) => {
                    const responseJSON = response.data;
                    for (const item in responseJSON) {
                        const jsonitem = responseJSON[item];
                        const nyFil: OpplastetFil = {
                            id: jsonitem.id,
                            filnavn: jsonitem.filnavn,
                        };
                        nyFilListe.push(nyFil);
                    }
                    setFilListe([...filListe, ...nyFilListe]);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        // }, [innsendingsId, id, filListe]); // loop
    }, [innsendingsId, id]);

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
                        setOpplastingStatus(id, 'LASTET_OPP');
                        console.log({ response: response.data });
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        reset({ filnavn: null });
                        setValue('file', null);
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
        <Panel border>
            <div>
                {skjemaurl && (
                    <a
                        target="_blank"
                        style={{ color: 'blue' }}
                        href={skjemaurl}
                        rel="noopener noreferrer"
                    >
                        Åpne skjema
                    </a>
                )}
            </div>
            <div>
                {vedleggsnr}: {label}
            </div>
            <form>
                <br />
                Beskriv vedlegg:
                <input {...register('filnavn')} />
                <br />
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
            </form>
            {filListe.length > 0 && (
                <div>
                    <span>Dokumenter du har lastet opp nå:</span>
                    <div>opplastingstatus: {opplastingsStatus}</div>
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
        </Panel>
    );
}
export default Vedlegg;
