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

const { NEXT_PUBLIC_MIN_SIDE_URL } = process.env;

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
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0 1rem;
    margin-bottom: 3rem;
`;

export default function SoknadSendtInn() {
    const { t } = useTranslation();

    const sprakListe = ['nb', 'nn', 'en'];
    return (
        <Style>
            <Head>
                <title>{t('feilside.soknadSendtInn.tittel')}</title>
            </Head>
            <GuidePanel poster="true">
                {sprakListe.map((sprak) => (
                    <div key={sprak}>
                        <Heading level="1" size="medium" spacing>
                            {t('feilside.soknadSendtInn.overskrift', {
                                lng: sprak,
                            })}
                        </Heading>
                        <BodyShort spacing>
                            {t('feilside.soknadSendtInn.melding', {
                                lng: sprak,
                            })}
                        </BodyShort>
                        <HorizontalLinksFlexbox>
                            <BodyShort spacing>
                                <NavLink
                                    href={NEXT_PUBLIC_MIN_SIDE_URL}
                                >
                                    {t(
                                        'feilside.soknadSendtInn.lenkeTekst.minSide',
                                        {
                                            lng: sprak,
                                        },
                                    )}
                                </NavLink>
                            </BodyShort>
                            <BodyShort spacing>
                                <NavLink
                                    href={`https://www.nav.no/soknader${sprak}ettersendelse/person`}
                                >
                                    {t(
                                        'feilside.soknadSendtInn.lenkeTekst.ettersende',
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
                    {t('feilside.statuskode')} 405
                </Detail>
            </GuidePanel>
        </Style>
    );
}
