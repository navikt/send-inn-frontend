import React from 'react';
import {
    Alert,
    Heading,
    BodyLong,
    Button,
    Link as NavLink,
    BodyShort,
} from '@navikt/ds-react';
import styled from 'styled-components';
import Link from 'next/link';
import getConfig from 'next/config';
import { useTranslation } from 'react-i18next';
import { Bold } from './textStyle';

const { publicRuntimeConfig } = getConfig();
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

const SjekkBoksListe = styled.ul`
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
    const { t } = useTranslation();

    return (
        <div>
            <Heading size="large" level="2" spacing>
                {t('kvittering.tittel')}
            </Heading>

            <Heading spacing size="medium" level="3">
                {t(
                    'kvittering.mottattDokumenter',

                    {
                        dato: formatertDato(
                            new Date(kvprops.mottattdato),
                        ),
                    },
                )}
            </Heading>
            <SjekkBoksListe>
                {kvprops && kvprops.hoveddokumentRef && (
                    <li>
                        <Alert variant="success" size="medium" inline>
                            <Bold>
                                {t('kvittering.skjema')}
                                {': '}
                            </Bold>
                            {kvprops.label}
                            <br />
                            <NavLink
                                href={`${publicRuntimeConfig.apiUrl}/${kvprops.hoveddokumentRef}`}
                                target="_blank"
                            >
                                {t('kvittering.skjemaLenke')}
                            </NavLink>
                        </Alert>
                    </li>
                )}
                {kvprops &&
                    kvprops.innsendteVedlegg &&
                    kvprops.innsendteVedlegg.length > 0 &&
                    kvprops.innsendteVedlegg.map((vedlegg) => {
                        return (
                            <li key={vedlegg.vedleggsnr}>
                                <Alert
                                    variant="success"
                                    size="medium"
                                    inline
                                >
                                    <Bold>
                                        {t('kvittering.vedlegg')}
                                        {': '}
                                    </Bold>
                                    {vedlegg.tittel}
                                </Alert>
                            </li>
                        );
                    })}
            </SjekkBoksListe>

            {kvprops.skalEttersendes &&
                kvprops.skalEttersendes.length > 0 && (
                    <Heading spacing size="medium" level="3">
                        {t('kvittering.maaEttersendes')}
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
                        {t('kvittering.sendesAvAndre')}
                    </Heading>
                )}

            <BodyShort as="ul" size="medium" spacing>
                {kvprops &&
                    kvprops.skalSendesAvAndre &&
                    kvprops.skalSendesAvAndre.length > 0 &&
                    kvprops.skalSendesAvAndre.map((vedlegg) => {
                        return (
                            <li key={vedlegg.vedleggsnr}>
                                {' '}
                                {vedlegg.tittel}
                            </li>
                        );
                    })}
            </BodyShort>

            {kvprops.skalEttersendes &&
                kvprops.skalEttersendes.length > 0 && (
                    <>
                        <StyledAlert variant="info">
                            <Heading spacing size="small" level="4">
                                {t('kvittering.fristEttersending', {
                                    dato: formatertDato(
                                        new Date(
                                            kvprops.ettersendingsfrist,
                                        ),
                                    ),
                                })}
                            </Heading>
                            <BodyLong>
                                {t('kvittering.ettersendingsInfo')}
                            </BodyLong>
                        </StyledAlert>
                    </>
                )}
            {!kvprops.skalEttersendes.length && (
                <StyledAlert variant="info">
                    {t('kvittering.altMottatInfo')}
                </StyledAlert>
            )}
            <Link
                href={process.env.NEXT_PUBLIC_MIN_SIDE_URL}
                passHref
            >
                <Button variant="secondary" size="medium">
                    {t('kvittering.minSideKnapp')}
                </Button>
            </Link>
        </div>
    );
}

export default Kvittering;
