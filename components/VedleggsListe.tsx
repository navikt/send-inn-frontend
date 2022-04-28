import React, { FC, ReactElement, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { VedleggType, SoknadType } from '../types/types';
import Vedlegg from '../components/Vedlegg';
import { VedleggProps } from '../components/Vedlegg';
import { Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { Modal, Heading, BodyLong } from '@navikt/ds-react';
import { FellesModal } from './FellesModal';
import { useTranslation } from 'react-i18next';

const initialVedleggsliste: VedleggType[] | [] = [];

export interface VedleggsListeProps {
    soknad: SoknadType;
    setSoknad: React.Dispatch<
        React.SetStateAction<SoknadType | null>
    >;
    vedleggsliste: VedleggType[] | [];
    setVedleggsListe: React.Dispatch<
        React.SetStateAction<VedleggType[] | []>
    >;
    erEttersending: boolean;
}

function soknadKlarForInnsending(
    vedleggsliste: VedleggType[],
    erEttersending: boolean,
): boolean {
    /*
    // TODO vi bør bruke enum i typescript
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
    vedleggsliste.forEach((element) => {
        // om det er ettersending kan vi ignorere hoveddokumentet/skjema, alle andre dokumenter må fortsatt være lastet opp
        const elementErRelevant = !(
            element.erHoveddokument && erEttersending
        );
        console.log('1' + elementErRelevant);
        console.log('2' + erEttersending);
        console.log('3' + element.opplastingsStatus);
        if (
            elementErRelevant &&
            element.opplastingsStatus === 'IKKE_VALGT'
        ) {
            console.log('return false');
            returnValue = returnValue && false;
        }
    });
    return returnValue;
}
function skjulHovedskjemaOm(
    erHovedskjema: boolean,
    erEttersending: boolean,
): boolean {
    if (erEttersending) {
        // vi viser en ettersending
        return !erHovedskjema; // om det ikke er et hovedskjema returneres det sant og vises
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
}: VedleggsListeProps) {
    const [soknadKlar, setSoknadKlar] = useState<boolean>(true);
    const router = useRouter();

    const [fortsettSenereSoknadModal, setForstettSenereSoknadModal] =
        useState(false);
    const [slettSoknadModal, setSlettSoknadModal] = useState(false);
    const [sendInnUferdigSoknadModal, setSendInnUferdigSoknadModal] =
        useState(false);
    const [
        sendInnKomplettSoknadModal,
        setSendInnKomplettSoknadModal,
    ] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    function setOpplastingStatus(id: number, status: string): void {
        alert('utløst' + id + status);
        const currentListe = [...vedleggsliste];
        const newListe = currentListe.map((el) =>
            el.id === id ? { ...el, opplastingsStatus: status } : el,
        );

        setVedleggsListe(newListe);
    }

    const tilMittNav = () => {
        console.log('TilMittNav');
        router.push('https://www.nav.no/no/ditt-nav');
    };

    const onSendInn = () => {
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .finally(() => {
                resetState();
                //TODO: Endre til "then", og gå til kvitteringside, nils arnes endringer skal nå gjøre at dette virker
                alert('Sendt inn');
                // tilMittNav()
            })
            .catch((e) => {
                //TODO: Error håndtering
                console.error(e);
            });
    };

    const slett = () => {
        axios
            .delete(
                `${process.env.NEXT_PUBLIC_API_URL}/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .finally(() => {
                resetState();
                alert('slettet');
            })
            .catch((e) => {
                //TODO: Error håndtering
                console.error(e);
            });
    };

    useEffect(() => {
        setSoknadKlar(
            soknadKlarForInnsending(vedleggsliste, erEttersending),
        );
    }, [vedleggsliste, erEttersending]);

    useEffect(() => {
        const changeLang = (lng) => {
            if (lng === 'no') {
                i18n.changeLanguage('nb');
            }
            if (lng === 'nn') {
                i18n.changeLanguage('nn');
            }
        };
        changeLang(soknad.spraak);
    }, [soknad, i18n]);

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };

    return (
        <div>
            {/* t('test')  dette tester flerspråksfuknsjonalitet*/}

            {/* soknad.spraak skriver ut språk */}

            {vedleggsliste.length === 0 && soknad.tittel}
            {vedleggsliste.length !== 0 && (
                <h1>Last opp vedlegg her:</h1>
            )}

            {soknad &&
                vedleggsliste.length > 0 &&
                vedleggsliste
                    .filter((x) =>
                        skjulHovedskjemaOm(
                            x.erHoveddokument,
                            erEttersending,
                        ),
                    )
                    .map((vedlegg, key) => {
                        return (
                            <Vedlegg
                                key={key}
                                innsendingsId={soknad.innsendingsId}
                                setOpplastingStatus={
                                    setOpplastingStatus
                                }
                                vedlegg={vedlegg}
                            />
                        );
                    })}

            {/**{soknad && (
                <Button onClick={onSendInn}>Send inn</Button>
            )} */}

            <div>
                {
                    soknadKlar ? (
                        <Button
                            onClick={() => {
                                if (!sendInnKomplettSoknadModal) {
                                    setSendInnKomplettSoknadModal(
                                        true,
                                    );
                                }
                            }}
                        >
                            Send inn komplett søknad
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                if (!sendInnUferdigSoknadModal) {
                                    setSendInnUferdigSoknadModal(
                                        true,
                                    );
                                }
                            }}
                        >
                            Send inn ufullstendig søknad
                        </Button>
                    ) // dette virker nå, men du må reloade
                }
            </div>

            <div>
                {/* lagre og fortsett senere */}
                <Button
                    onClick={() => {
                        if (!fortsettSenereSoknadModal) {
                            setForstettSenereSoknadModal(true);
                        }
                    }}
                >
                    Lagre og fortsett senere
                </Button>
            </div>
            <div>
                {/*kall slettsøknad på api, deretter, gå til ditt nav
kanskje popup om at dette vil slette innhold? */}
                <Button
                    onClick={() => {
                        if (!slettSoknadModal) {
                            setSlettSoknadModal(true);
                        }
                    }}
                    variant="secondary"
                >
                    Avbryt søknad
                </Button>

                {/* open={open} onClose={() => setOpen(false)} */}

                {/*     const [isModalOpen, setIsModalOpen] = useState(false); */}

                {/*

                TODO: adding the new modals

                hvis fremgang her
                1. send inn komplett onSendInn()
                2. send inn uferdig onSendInn()
                3 avbryt (slett)
                4 avslutt slett()

                bare lag en state per modal?

                jeg tror vi trenger flere av dem

                kanskje noe state for å bestemme aktiv modal?

                teksten er fucka og har rare formateringstegn, jeg måtte avbryte forsøk pga rot med de tegnene

                har laget currentmodalstate
                
                */}

                <FellesModal
                    open={fortsettSenereSoknadModal}
                    setOpen={setForstettSenereSoknadModal}
                    onAccept={tilMittNav}
                    acceptButtonText="Ja, lagre og fortsett senere"
                >
                    <Heading spacing level="1" size="large">
                        Er du sikker på at du vil lagre søknaden og
                        fortsette senere?
                    </Heading>
                    <Heading spacing level="2" size="medium">
                        Vær oppmerksom på:
                    </Heading>
                    <BodyLong spacing>
                        Søknaden blir IKKE sendt til saksbehandler i
                        NAV nå, men kunmellomlagret slik at du kan
                        gjenoppta den senere.
                    </BodyLong>
                    <BodyLong>
                        Hvis du ønsker å sette dagens dato som
                        startdato for søknaden må du klikke på knappen
                        Send inn til NAV. Du kan gjøre dette selv om
                        du ikke har all dokumentasjon nå. Du kan
                        ettersende manglende dokumentasjon her på
                        nav.no innen (dato/antall uker/dager)
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={slettSoknadModal}
                    setOpen={setSlettSoknadModal}
                    onAccept={slett}
                    acceptButtonText="Ja, avbryt og slett søknaden"
                >
                    <Heading spacing level="1" size="large">
                        Er du sikker på at du vil avbryte søknaden?
                    </Heading>
                    <Heading spacing level="2" size="medium">
                        Vær oppmerksom på:
                    </Heading>
                    <BodyLong spacing>
                        Søknaden og all dokumentasjon du har lastet
                        opp på denne siden vil bli slettet.
                    </BodyLong>
                    <BodyLong>
                        Hvis du ønsker å komme tilbake og fortsette
                        søknaden senere, må du klikke på knappen
                        “Lagre og fortsett senere”.
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={sendInnUferdigSoknadModal}
                    setOpen={setSendInnUferdigSoknadModal}
                    onAccept={onSendInn}
                    acceptButtonText="Ja, send søknaden nå"
                >
                    <Heading spacing level="1" size="large">
                        Er du sikker på at du vil sende søknaden nå?
                    </Heading>
                    <Heading spacing level="2" size="medium">
                        Vær oppmerksom på:
                    </Heading>
                    <BodyLong spacing>
                        Dagens dato vil bli satt som startdato for
                        søknaden din.
                    </BodyLong>
                    <BodyLong>
                        Du har ikke lastet opp all nødvendig
                        dokumentasjon. Vi kan ikke behandle søknaden
                        din før du har ettersendt denne
                        dokumentasjonen.Hvis du velger å sende
                        søknaden nå må du ettersende
                        dokumentasjonensom mangler innen DATO. Vi vil
                        sende deg en notifikasjon på DittNAV som
                        spesifiserer hva som må ettersendes. Klikk på
                        notifikasjonen når du har skaffet
                        dokumentasjonen og er klar til å ettersende
                        dette.
                    </BodyLong>
                </FellesModal>

                <FellesModal
                    open={sendInnKomplettSoknadModal}
                    setOpen={setSendInnKomplettSoknadModal}
                    onAccept={tilMittNav}
                    acceptButtonText="Ja, send søknaden nå"
                >
                    <Heading spacing level="1" size="large">
                        Er du sikker på at du vil sende søknaden nå?
                    </Heading>
                    <Heading spacing level="2" size="medium">
                        Vær oppmerksom på:
                    </Heading>
                    <BodyLong spacing>
                        Dagens dato vil bli satt som startdato for
                        søknaden din.
                    </BodyLong>
                    <BodyLong>
                        Du har lastet opp all dokumentasjon som er
                        nødvendig for å behandle søknaden din.
                    </BodyLong>
                </FellesModal>
            </div>
        </div>
    );
}
export default VedleggsListe;
