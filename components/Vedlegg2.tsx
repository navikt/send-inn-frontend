import React, { FC, ReactElement } from 'react';

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
};

/*
const Vedlegg: FC<VedleggProps> = (
    propexample
): ReactElement => {
    return <div> {props.vedleggsnr}</div>;

};
*/

function VedleggSide({id}:VedleggProps){

    return <div> {id}</div>;

}
export default VedleggSide;