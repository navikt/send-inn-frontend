import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { VedleggType, SoknadType } from '../types/api';
import Vedlegg from "../components/Vedlegg"

interface VedleggsListeProps {
    soknad: SoknadType,
    setSoknad: React.Dispatch<React.SetStateAction<SoknadType | null>>,
    vedleggsliste: VedleggType[] | [];
    setVedleggsListe: React.Dispatch<React.SetStateAction<VedleggType[] | []>>,

};


const initialVedleggsliste: VedleggType[] | [] = [];


/*

Updating state in parent:
https://stackoverflow.com/a/66186184



This is how we can do it with the new useState hook. Method - Pass the state changer function as a props to the child component and do whatever you want to do with the function

import React, {useState} from 'react';

const ParentComponent = () => {
  const[state, setState]=useState('');

  return(
    <ChildConmponent stateChanger={setState} />
  )
}


const ChildConmponent = ({stateChanger, ...rest}) => {
  return(
    <button onClick={() => stateChanger('New data')}></button>
  )
}


 */
function VedleggsListe({
                           soknad,
                            setSoknad,
                           vedleggsliste,
                           setVedleggsListe,
                       } : VedleggsListeProps) {



    /*let list = vedleggsListe.map((vedlegg) => {
        <Vedlegg {...vedlegg} />;
    })
    list = Object.keys(vedleggsListe).map(function(key, index) {
        vedleggsListe[key] *= 2;
    });
    list = (vedleggsListe) => {
    for (var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            myObject[key] *= 2;
        }
    }g} />;
    })
    list = Object.keys(vedleggsListe).map(function(key, index) {
        vedleggsListe[key] *= 2;
    }

     */
    //let newlist = Array.from(props.data);

    const onSendInn = () => {
        axios
            .post(
                `http://localhost:9064/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .finally(() => {
                resetState();
                //TODO: Endre til "then", og gå til kvitteringside
                alert('Sendt inn');
            })
            .catch((e) => {
                //TODO: Error håndtering
                console.error(e);
            });
    };

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };




    return (
        <div>


            {vedleggsliste.length === 0 && (
                soknad.tittel
            )}
            {vedleggsliste.length !== 0 && (
                <h1>Last opp vedlegg her:</h1>
            )}
            {soknad && vedleggsliste.length > 0 &&
                vedleggsliste.map((vedlegg, key) => {
                    console.log(vedlegg);
                    return (
                        <Vedlegg
                            key={key}
                            innsendingsId={soknad.innsendingsId}
                            {...vedlegg}
                        />
                    );
                })}
            {soknad && (
                <button>HELLO</button>
            )}

            {soknad && (
                <button onClick={onSendInn}>Send inn</button>
            )}

        </div>

    );
}
export default VedleggsListe;