import React, { FC, ReactElement, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { VedleggType, SoknadType } from '../types/types';
import Vedlegg from "../components/Vedlegg"
import { VedleggsListeProps } from '../types/types';
import { Button } from '@navikt/ds-react';

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


function soknadKlarForInnsending(vedleggsliste : VedleggType[], erEttersending : boolean) : boolean {
    /*
    muligheter for opplastingsstatus per 17 feb 2022:
    enum class OpplastingsStatus {
        IKKE_VALGT, // det er ikke blitt lastet opp noe på vedlegget
        SEND_SENERE, // ikke i bruk for frontend
        LASTET_OPP, // det er lastet en eller flere filer på dette vedlegget 
        SEND_I_POST, // ikke i bruk
        SENDES_AV_ANDRE, // ikke i bruk
        SENDES_IKKE, // ikke i bruk
        INNSENDT, // det er blitt sendt inn en fil til NAV (aktuelt ved ettersending).  
        VEDLEGG_ALLEREDE_SENDT // ikke i bruk
    }
    */
    let returnValue = true;
    vedleggsliste.forEach(element => {
        // om det er ettersending kan vi ignorere hoveddokumentet/skjema, alle andre dokumenter må fortsatt være lastet opp
        const elementErRelevant =  !(element.erHoveddokument && erEttersending);
        console.log("1" + elementErRelevant)
        console.log("2" + erEttersending)
        console.log("3" + element.opplastingsStatus)
        if (elementErRelevant && element.opplastingsStatus === "IKKE_VALGT") {
            console.log("return false")
            returnValue = returnValue && false; 
        }
    })
    return returnValue;
}
function skjulHovedskjemaOm(erHovedskjema : boolean, erEttersending : boolean) : boolean {
    if (erEttersending) { // vi viser en ettersending
        return !erHovedskjema;  // om det ikke er et hovedskjema returneres det sant og vises
    } else {
        return true; // om det ikke er en ettersending skal vi alltid vise alt og returnerer true
    }
}     
function VedleggsListe({
                           soknad,
                            setSoknad,
                           vedleggsliste,
                           setVedleggsListe,
                           erEttersending,
                       } : VedleggsListeProps) {
    const [soknadKlar, setSoknadKlar] = useState<boolean>(true);

    function setListe(id : number, vedlegg : VedleggType) : void {
        let currentListe = [...vedleggsliste]
        let newListe = currentListe.map(el => (
            el.id===id ? {...vedlegg}: el
      ))

      setVedleggsListe(newListe);
      
    }

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
    /*
    const [komplettStatus, setFilListe] = useState<OpplastetFil[]>([]);

    useEffect(() => {
        //const innsendingsId = query.innsendingsId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
        // const innsendingsId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
        //const { brukerid } = data;
        //const { vedleggsIder } = query;
        

// }, [innsendingsId, id, filListe]); // loop
}, [vedleggsliste]);
*/         
useEffect(() => {
    //const innsendingsId = query.innsendingsId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
    // const innsendingsId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
    //const { brukerid } = data;
    //const { vedleggsIder } = query;
    setSoknadKlar(soknadKlarForInnsending(vedleggsliste, erEttersending));
// }, [innsendingsId, id, filListe]); // loop
}, [vedleggsliste, erEttersending]);

    

    const onSendInn = () => {
        axios
            .post(
                `http://localhost:9064/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .finally(() => {
                resetState();
                //TODO: Endre til "then", og gå til kvitteringside, nils arnes endringer skal nå gjøre at dette virker
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
            {soknadKlar ? <div> er kjempe klar </div> : <div> er ikke klar </div>  // dette virker nå, men du må reloade
            }
            {soknadKlarForInnsending(vedleggsliste, erEttersending).toString()  }
             {soknad && vedleggsliste.length > 0 &&
                    vedleggsliste.filter(x => skjulHovedskjemaOm(x.erHoveddokument, erEttersending)).map((vedlegg, key) => { 
                    return (
                        <Vedlegg
                            key={key}
                            innsendingsId={soknad.innsendingsId}
                            setListe={setListe}
                            {...vedlegg}
                        />
                    );
                })}
       
            {soknad && (
                <Button onClick={onSendInn}>Send inn</Button>
            )}

        </div>

    );
}
export default VedleggsListe;