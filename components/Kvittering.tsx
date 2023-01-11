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
import getConfig from 'next/config';
import { useTranslation } from 'react-i18next';
import { Bold } from './textStyle';
import { formatertDato } from '../utils/dato';

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

export function Kvittering({ kvprops }: KvitteringsProps) {
    const { t } = useTranslation();

    return (
        <div>
            <Heading
                as="p"
                size="large"
                spacing
                data-cy="kvitteringOverskrift"
            >
                {t('kvittering.tittel')}
            </Heading>
            <section aria-labelledby="mottattDokumenterHeading">
                <Heading
                    id="mottattDokumenterHeading"
                    spacing
                    size="medium"
                    level="2"
                >
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
                            <Alert
                                variant="success"
                                size="medium"
                                inline
                            >
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
            </section>

            {kvprops.skalEttersendes &&
                kvprops.skalEttersendes.length > 0 && (
                    <section aria-labelledby="maaEttersendesHeading">
                        <Heading
                            id={'maaEttersendesHeading'}
                            spacing
                            size="medium"
                            level="2"
                        >
                            {t('kvittering.maaEttersendes')}
                        </Heading>

                        <BodyShort as="ul" size="medium" spacing>
                            {kvprops.skalEttersendes.map(
                                (vedlegg) => {
                                    return (
                                        <li key={vedlegg.vedleggsnr}>
                                            {' '}
                                            {vedlegg.tittel}
                                        </li>
                                    );
                                },
                            )}
                        </BodyShort>
                    </section>
                )}

            {kvprops.skalSendesAvAndre &&
                kvprops.skalSendesAvAndre.length > 0 && (
                    <section aria-labelledby="sendesAvAndreHeading">
                        <Heading
                            id={'sendesAvAndreHeading'}
                            spacing
                            size="medium"
                            level="2"
                        >
                            {t('kvittering.sendesAvAndre')}
                        </Heading>

                        <BodyShort as="ul" size="medium" spacing>
                            {kvprops.skalSendesAvAndre.map(
                                (vedlegg) => {
                                    return (
                                        <li key={vedlegg.vedleggsnr}>
                                            {' '}
                                            {vedlegg.tittel}
                                        </li>
                                    );
                                },
                            )}
                        </BodyShort>
                    </section>
                )}

            {kvprops.skalEttersendes &&
                kvprops.skalEttersendes.length > 0 && (
                    <>
                        <StyledAlert variant="info">
                            <Heading level={'3'} spacing size="small">
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
            <Button
                as="a"
                href={process.env.NEXT_PUBLIC_MIN_SIDE_URL}
                variant="secondary"
                size="medium"
            >
                {t('kvittering.minSideKnapp')}
            </Button>
        </div>
    );
}

export default Kvittering;
