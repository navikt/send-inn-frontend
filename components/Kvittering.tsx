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
export interface KvitteringsProps {
    kvprops: KvitteringsDto;
}

export interface KvitteringsDto {
    innsendingsId: string;
    label: string;
    mottattdato: string;
    hoveddokumentRef: string;
    innsendteVedlegg: {
        vedleggsnr: string;
        tittel: string;
    }[];
    skalEttersendes: {
        vedleggsnr: string;
        tittel: string;
    }[];
    ettersendingsfrist: string;
}
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

export function Kvittering({ kvprops }: KvitteringsProps) {
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
                    {formatertDato(new Date(kvprops.mottattdato))}:
                </Heading>
                <SjekkBoksListe>
                    {kvprops && kvprops.hoveddokumentRef && (
                        <Alert variant="success" size="medium" inline>
                            {' '}
                            {kvprops.label}
                            <br />
                            <Link
                                href={`${process.env.NEXT_PUBLIC_API_URL}/${kvprops.hoveddokumentRef}`}
                            >
                                <a target="_blank">
                                    Last ned kopi (åpnes i en ny fane)
                                </a>
                            </Link>
                        </Alert>
                    )}
                    {kvprops &&
                        kvprops.innsendteVedlegg &&
                        kvprops.innsendteVedlegg.length > 0 &&
                        kvprops.innsendteVedlegg.map(
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
                    {kvprops &&
                        kvprops.skalEttersendes &&
                        kvprops.skalEttersendes.length > 0 &&
                        kvprops.skalEttersendes.map(
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
                            new Date(kvprops.ettersendingsfrist),
                        )}
                    </Heading>
                    <BodyLong>
                        Oppgaven for å ettersende dokumentasjonen
                        finner du øverst på Ditt NAV.
                    </BodyLong>
                </Alert>

                <Link href="https://www.nav.no/no/ditt-nav" passHref>
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
