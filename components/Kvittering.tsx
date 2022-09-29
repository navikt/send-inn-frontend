import type { NextPage } from 'next';
import React from 'react';
import '@navikt/ds-css';

// React
import { Success, Attachment, FileContent } from '@navikt/ds-icons';
import {
    Alert,
    Heading,
    BodyLong,
    Button,
    Link as NavLink,
    BodyShort,
} from '@navikt/ds-react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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
    skalSendesAvAndre: {
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

const SjekkBoksListe = styled.ul`
    /* background-color: red; */

    list-style: none;
    margin: 0;
    padding-left: 10px;
    margin-bottom: 2.75rem;

    li:not(:last-child) {
        padding-bottom: 1rem;
    }
`;

const StyledAlert = styled(Alert)`
    margin-bottom: 2.75rem;
`;

export function seksUkerFraDato(date: Date) {
    const numberOfDaysToAdd = 7 * 6; // 7 dager * 6 uker
    return new Date(date.setDate(date.getDate() + numberOfDaysToAdd));
}

export function formatertDato(date: Date) {
    // gir alltid dato og mnd med to tall
    return `${('0' + date.getDate()).slice(-2)}.${(
        '0' +
        (date.getMonth() + 1)
    ).slice(-2)}.${date.getFullYear()}`;
}

export function Kvittering({ kvprops }: KvitteringsProps) {
    return (
        <KompStyle>
            <div>
                <Heading size="large" level="2" spacing>
                    Takk!
                </Heading>

                <Heading spacing size="medium" level="3">
                    Vi mottok disse dokumentene{' '}
                    {formatertDato(new Date(kvprops.mottattdato))}:
                </Heading>
                <SjekkBoksListe>
                    {kvprops && kvprops.hoveddokumentRef && (
                        <li>
                            <Alert
                                variant="success"
                                size="medium"
                                inline
                            >
                                {' '}
                                {kvprops.label}
                                <br />
                                <NavLink
                                    href={`${publicRuntimeConfig.apiUrl}/${kvprops.hoveddokumentRef}`}
                                    target="_blank"
                                >
                                    Last ned kopi (åpnes i en ny fane)
                                </NavLink>
                            </Alert>
                        </li>
                    )}
                    {kvprops &&
                        kvprops.innsendteVedlegg &&
                        kvprops.innsendteVedlegg.length > 0 &&
                        kvprops.innsendteVedlegg.map(
                            (vedlegg, key) => {
                                return (
                                    <li key={vedlegg.vedleggsnr}>
                                        <Alert
                                            variant="success"
                                            size="medium"
                                            inline
                                        >
                                            {' '}
                                            {vedlegg.tittel}
                                        </Alert>
                                    </li>
                                );
                            },
                        )}
                </SjekkBoksListe>

                {kvprops.skalEttersendes &&
                    kvprops.skalEttersendes.length > 0 && (
                        <Heading spacing size="medium" level="3">
                            Dokument(er) som må ettersendes:
                        </Heading>
                    )}

                <BodyShort as="ul" size="medium" spacing>
                    {kvprops &&
                        kvprops.skalEttersendes &&
                        kvprops.skalEttersendes.length > 0 &&
                        kvprops.skalEttersendes.map((vedlegg) => {
                            return (
                                <li key={vedlegg.vedleggsnr}>
                                    {' '}
                                    {vedlegg.tittel}
                                </li>
                            );
                        })}
                </BodyShort>

                {kvprops.skalSendesAvAndre &&
                    kvprops.skalSendesAvAndre.length > 0 && (
                        <Heading spacing size="medium" level="3">
                            Dokument(er) som skal sendes av andre:
                        </Heading>
                    )}

                <BodyShort as="ul" size="medium" spacing>
                    {kvprops &&
                        kvprops.skalSendesAvAndre &&
                        kvprops.skalSendesAvAndre.length > 0 &&
                        kvprops.skalSendesAvAndre.map(
                            (vedlegg, key) => {
                                return (
                                    <li key={vedlegg.vedleggsnr}>
                                        {' '}
                                        {vedlegg.tittel}
                                    </li>
                                );
                            },
                        )}
                </BodyShort>

                {kvprops.skalEttersendes &&
                    kvprops.skalEttersendes.length > 0 && (
                        <>
                            <StyledAlert variant="info">
                                <Heading
                                    spacing
                                    size="small"
                                    level="2"
                                >
                                    Frist for å ettersende
                                    dokumentene:{' '}
                                    {formatertDato(
                                        new Date(
                                            kvprops.ettersendingsfrist,
                                        ),
                                    )}
                                </Heading>
                                <BodyLong>
                                    Vi kan ikke behandle saken din før
                                    vi har mottatt disse. Oppgaven for
                                    å ettersende dokumentasjonen
                                    finner du øverst på Min side.
                                </BodyLong>
                            </StyledAlert>
                        </>
                    )}
                {!kvprops.skalEttersendes.length && (
                    <StyledAlert variant="info">
                        Alle nødvendige dokumenter er mottatt. Du
                        finner dem under Dine saker på Min side.
                    </StyledAlert>
                )}
                <Link
                    href={process.env.NEXT_PUBLIC_MIN_SIDE_URL}
                    passHref
                >
                    <Button variant="secondary" size="medium">
                        Gå til Min side
                    </Button>
                </Link>
            </div>
        </KompStyle>
    );
}

export default Kvittering;
