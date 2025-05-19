import { BodyShort, Box, Heading, Page, VStack } from '@navikt/ds-react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function SoknadSendtInn() {
  const { t } = useTranslation();

  const urlToLocaleUrl = (url: string, locale: string) => (locale !== 'en' ? url : `${url}/${locale}`);

  const sprakListe = ['nb', 'nn', 'en'];
  return (
    <Page>
      <Page.Block as="main" width="xl" gutters>
        <Box paddingBlock="12">
          <VStack gap="16">
            <VStack gap="12" align="start">
              {sprakListe.map((sprak) => (
                <div key={sprak}>
                  <Head>
                    <title>{t('feilside.soknadSendtInn.tittel')}</title>
                  </Head>
                  <div>
                    <Heading level="1" size="medium" spacing>
                      {t('feilside.soknadSendtInn.overskrift', {
                        lng: sprak,
                      })}
                    </Heading>
                    <BodyShort spacing>
                      {t('feilside.soknadSendtInn.innhold', {
                        lng: sprak,
                      })}
                    </BodyShort>
                    <BodyShort spacing>
                      {t('feilside.soknadSendtInn.dokumentArkivMelding', {
                        lng: sprak,
                      })}
                      <Link href={urlToLocaleUrl('https://www.nav.no/dokumentarkiv', sprak)}>
                        {t('feilside.soknadSendtInn.lenkeTekst.dokumentArkiv', {
                          lng: sprak,
                        })}
                      </Link>
                    </BodyShort>
                    <BodyShort spacing>
                      {t('feilside.soknadSendtInn.ettersendingMelding', {
                        lng: sprak,
                      })}
                      <Link href={urlToLocaleUrl('https://www.nav.no/ettersende', sprak)}>
                        {t('feilside.soknadSendtInn.lenkeTekst.ettersende', {
                          lng: sprak,
                        })}
                      </Link>
                      {t('feilside.soknadSendtInn.ettersendingMelding2', {
                        lng: sprak,
                      })}
                    </BodyShort>
                  </div>
                </div>
              ))}
            </VStack>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
}
