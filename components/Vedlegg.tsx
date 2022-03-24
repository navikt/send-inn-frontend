import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Panel } from '@navikt/ds-react';
import { Filopplaster } from './Filopplaster';

import { setOpplastingStatusType } from '../types/types';

import { OpplastetFil } from '../types/types';

export interface VedleggProps {
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

    const oppdaterFilListe = (filData: OpplastetFil) => {
        setFilListe([...filListe, filData]);
    };

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
            {/* beskrivelse ligger i mange søknader fra fyll ut, men finnes ikke for dokumentinnsending */}
            {beskrivelse && <div>{beskrivelse}</div>}
            <Filopplaster
                id={id}
                innsendingsId={innsendingsId}
                setOpplastingStatus={setOpplastingStatus}
                oppdaterFilListe={oppdaterFilListe}
            />
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
