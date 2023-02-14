import styled from 'styled-components';
import {
    BodyShort,
    Detail,
    Heading,
    GuidePanel,
    Link as NavLink,
} from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';

const Style = styled.div`
    min-height: 100vh;
    max-width: 50rem;
    margin: 0 auto;
    padding-top: 44px;
    margin-bottom: 44px;
`;

const HorizontalLinksFlexbox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-bottom: 3rem;
`;

export default function Custom404() {
    const { t } = useTranslation();

    const sprakListe = ['nb', 'nn', 'en'];
    return (
        <Style>
            <Head>
                <title>{t('feilside.404.tittel')}</title>
            </Head>
            <GuidePanel poster="true">
                {sprakListe.map((sprak) => (
                    <div key={sprak}>
                        <Heading level="1" size="xlarge" spacing>
                            {t('feilside.404.overskrift', {
                                lng: sprak,
                            })}
                        </Heading>
                        <BodyShort spacing>
                            {t('feilside.404.p1', {
                                lng: sprak,
                            })}
                        </BodyShort>
                        <BodyShort spacing>
                            {t('feilside.404.p2', {
                                lng: sprak,
                            })}
                        </BodyShort>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <NavLink href="https://nav.no">
                                    {t(
                                        'feilside.404.lenkeTekst.forside',
                                        {
                                            lng: sprak,
                                        },
                                    )}
                                </NavLink>
                            </BodyShort>
                            <BodyShort spacing>
                                <NavLink
                                    href={`https://www.nav.no/person/kontakt-oss/${sprak}/tilbakemeldinger/feil-og-mangler`}
                                >
                                    {t(
                                        'feilside.404.lenkeTekst.meldFra',
                                        {
                                            lng: sprak,
                                        },
                                    )}
                                </NavLink>
                            </BodyShort>
                        </HorizontalLinksFlexbox>
                    </div>
                ))}

                <Detail spacing>
                    {t('feilside.statuskode')} 404
                </Detail>
            </GuidePanel>
        </Style>
    );
}
