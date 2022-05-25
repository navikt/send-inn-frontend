import type { NextPage } from 'next';
import React from 'react';
import '@navikt/ds-css';

// React
import { Success, Attachment, FileContent } from '@navikt/ds-icons';
import { Alert, Heading, BodyLong, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

// Takk bare fet og stor .. vi mottok h2 .. ul ikoner som bullet ... h2 for doks som skal ettersendes, ny ul med forskjellig bullet ... p ...

const example = {
    innsendingsId: '18c02791-82ac-42e6-ae15-419dd27459b2',
    label: 'Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)',
    mottattdato: '2022-05-24T12:00:24.8398842Z',
    hoveddokumentRef:
        'soknad/18c02791-82ac-42e6-ae15-419dd27459b2/vedlegg/1/fil/2',
    innsendteVedlegg: [
        {
            vedleggsnr: 'C1',
            tittel: 'Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ',
        },
        {
            vedleggsnr: 'W1',
            tittel: 'Dokumentasjon på mottatt bidrag',
        },
    ],
    skalEttersendes: [
        {
            vedleggsnr: 'C1',
            tittel: 'Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ',
        },
        {
            vedleggsnr: 'W1',
            tittel: 'Dokumentasjon på mottatt bidrag',
        },
    ],
    ettersendingsfrist: '2022-07-05T12:00:24.8398842Z',
};
// TODO husk å legge inn dato på toppen, dato basert på innleveringsdato på bunnen og lenken til dokumentet

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

function seksUkerFraDato(date: Date) {
    const numberOfDaysToAdd = 7 * 6; // 7 dager * 6 uker
    return new Date(date.setDate(date.getDate() + numberOfDaysToAdd));
}

function formatertDato(date: Date) {
    // gir alltid dato og mnd med to tall
    return `${('0' + date.getDate()).slice(-2)}.${(
        '0' +
        (date.getMonth() + 1)
    ).slice(-2)}.${date.getFullYear()}`;
}

function Kvittering() {
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
                    Vi mottok disse dokumentene{' '}
                    {formatertDato(new Date(example.mottattdato))}:
                </Heading>
                <SjekkBoksListe>
                    {example && example.hoveddokumentRef && (
                        <Alert variant="success" size="medium" inline>
                            {' '}
                            {example.label}
                            {/* lenke her*/}
                        </Alert>
                    )}
                    {example &&
                        example.innsendteVedlegg.length > 0 &&
                        example.innsendteVedlegg.map(
                            (vedlegg, key) => {
                                return (
                                    <Alert
                                        variant="success"
                                        size="medium"
                                        inline
                                        key={vedlegg.vedleggsnr}
                                    >
                                        {' '}
                                        {vedlegg.tittel}
                                    </Alert>
                                );
                            },
                        )}
                </SjekkBoksListe>

                <Heading spacing size="small" level="2">
                    Dokument(er) som må ettersendes:
                </Heading>

                <ul>
                    {example &&
                        example.innsendteVedlegg.length > 0 &&
                        example.innsendteVedlegg.map(
                            (vedlegg, key) => {
                                return (
                                    <li key={vedlegg.vedleggsnr}>
                                        {' '}
                                        {vedlegg.tittel}
                                    </li>
                                );
                            },
                        )}
                </ul>

                <p>
                    {' '}
                    Vi kan ikke behandle saken din før vi har mottatt
                    disse.
                </p>
                <Alert variant="info">
                    <Heading spacing size="small" level="2">
                        Frist for å ettersende dokumentene:{' '}
                        {formatertDato(
                            new Date(example.ettersendingsfrist),
                        )}
                    </Heading>
                    <BodyLong>
                        Du finner en oppgave for å ettersende
                        dokumentasjonen under “Varslinger” på Min Side
                        / DittNAV. Under “Varslinger” på Min Side /
                        DittNAV finner du en oppgave for å ettersende
                        dokumentasjon til denne saken.
                    </BodyLong>
                </Alert>

                <Link href="https://www.nav.no/no/ditt-nav">
                    <Button variant="secondary" size="medium">
                        Gå til Ditt NAV
                    </Button>
                </Link>
            </div>

            <hr />
        </KompStyle>
    );
}

export default Kvittering;
