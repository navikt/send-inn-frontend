import type { NextPage } from 'next';
import React from 'react';
import '@navikt/ds-css';

// React
import { Success, Attachment, FileContent } from '@navikt/ds-icons';
import { Alert, Heading, BodyLong, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import Image from 'next/image';

// Takk bare fet og stor .. vi mottok h2 .. ul ikoner som bullet ... h2 for doks som skal ettersendes, ny ul med forskjellig bullet ... p ...

const KompStyle = styled.div`
    /* background-color: red; */
    .bigtext {
        font-weight: bold;
        font-size: 30px;
    }

    .sjekkboksliste {
        list-style-type: none;
    }
`;

const kvittering: NextPage = () => {
    const SjekkBoksListe = styled.ul`
        /* background-color: red; */

        list-style: none;
        padding-left: 10px;
    `;

    return (
        <KompStyle>
            <div>
                <p className="bigtext">Takk!</p>

                <Heading spacing size="medium" level="2">
                    Vi har motatt:
                </Heading>

                <SjekkBoksListe>
                    <li>
                        <Success /> Søknad / skjema: Søknad om stønad
                        til anskaffelse av motorkjøretøy og eller
                        spesialutstyr og tilpassing til bil. Last ned
                        kopi (åpnes i en ny fane)
                    </li>
                    <li>
                        <Success />
                        Vedlegg: Erklæring fra ergo- eller
                        fysioterapeut i forbindelse med søknad om
                        motorkjøretøy og spesialutstyr / tilpasning
                    </li>
                    <li>
                        <Success /> Vedlegg: Legeerklæring for
                        motorkjøretøy
                    </li>
                </SjekkBoksListe>

                <Heading spacing size="small" level="2">
                    Dokument(er) som må ettersendes:
                </Heading>

                <ul>
                    <li>
                        Bekreftelse fra bileier om at utstyret kan
                        monteres i bilen
                    </li>
                    <li>Dokumentasjon av veiforhold</li>
                    <li>
                        Kopi av førerkortet til sjåføren(e)s samtykke
                        til å være sjåfør for deg
                    </li>
                </ul>

                <p>
                    {' '}
                    Vi kan ikke behandle saken din før vi har mottatt
                    disse.
                </p>
                <Alert variant="info">
                    <Heading spacing size="small" level="2">
                        Frist for å ettersende dokumentene: 24.06.2021
                    </Heading>
                    <BodyLong>
                        Du finner en oppgave for å ettersende
                        dokumentasjonen under “Varslinger” på Min Side
                        / DittNAV. Under “Varslinger” på Min Side /
                        DittNAV finner du en oppgave for å ettersende
                        dokumentasjon til denne saken.
                    </BodyLong>
                </Alert>
                <Button variant="secondary" size="medium">
                    Gå til Ditt NAV
                </Button>
            </div>

            <hr />

            <div>
                <p>Kvittering</p>
                <p>
                    <Success /> Vi har motatt :
                </p>
                <p>
                    <FileContent /> Søknad / skjema: Søknad om stønad
                    til anskaffelse av motorkjøretøy og eller
                    spesialutstyr og tilpassing til bil. Last ned kopi
                    (åpnes i en ny fane)
                </p>

                <p>
                    <Attachment />
                    Vedlegg: Erklæring fra ergo- eller fysioterapeut i
                    forbindelse med søknad om motorkjøretøy og
                    spesialutstyr / tilpasning
                </p>
                <p>
                    <Attachment /> Vedlegg: Legeerklæring for
                    motorkjøretøy
                </p>
                <p>Mottatt: 23.03.2022</p>
                <Alert variant="success">
                    Vi har nå mottatt alle dokumentene vi trenger for
                    å behandle saken din.
                </Alert>
                <Button variant="secondary" size="medium">
                    Avslutt
                </Button>
            </div>
            <hr />

            <div>
                <p className="bigtext">Takk!</p>

                <Heading spacing size="medium" level="2">
                    Vi har motatt:
                </Heading>

                <SjekkBoksListe>
                    <li>
                        <Alert variant="success" size="medium" inline>
                            {' '}
                            Søknad / skjema: Søknad om stønad til
                            anskaffelse av motorkjøretøy og eller
                            spesialutstyr og tilpassing til bil. Last
                            ned kopi (åpnes i en ny fane)
                        </Alert>
                    </li>
                    <li>
                        <Alert variant="success" size="medium" inline>
                            Vedlegg: Erklæring fra ergo- eller
                            fysioterapeut i forbindelse med søknad om
                            motorkjøretøy og spesialutstyr /
                            tilpasning
                        </Alert>
                    </li>
                    <li>
                        <Alert variant="success" size="medium" inline>
                            Vedlegg: Legeerklæring for motorkjøretøy
                        </Alert>
                    </li>
                </SjekkBoksListe>

                <Heading spacing size="small" level="2">
                    Dokument(er) som må ettersendes:
                </Heading>

                <ul>
                    <li>
                        Bekreftelse fra bileier om at utstyret kan
                        monteres i bilen
                    </li>
                    <li>Dokumentasjon av veiforhold</li>
                    <li>
                        Kopi av førerkortet til sjåføren(e)s samtykke
                        til å være sjåfør for deg
                    </li>
                </ul>

                <p>
                    {' '}
                    Vi kan ikke behandle saken din før vi har mottatt
                    disse.
                </p>
                <Alert variant="info">
                    <Heading spacing size="small" level="2">
                        Frist for å ettersende dokumentene: 24.06.2021
                    </Heading>
                    <BodyLong>
                        Du finner en oppgave for å ettersende
                        dokumentasjonen under “Varslinger” på Min Side
                        / DittNAV. Under “Varslinger” på Min Side /
                        DittNAV finner du en oppgave for å ettersende
                        dokumentasjon til denne saken.
                    </BodyLong>
                </Alert>
                <Button variant="secondary" size="medium">
                    Gå til Ditt NAV
                </Button>
            </div>

            <hr />
        </KompStyle>
    );
};

export default kvittering;
