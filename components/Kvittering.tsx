import { Alert, BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import getConfig from 'next/config';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatertDato } from '../utils/dato';
import { useVedleggslisteContext } from './VedleggsListe';
import { LastNedKnapp } from './common/LastNedKnapp';
import { KvitteringsTillegg } from './skjemaSpesifikt/KvitteringsTillegg';
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
  padding-left: 0;

  li:not(:last-child) {
    padding-bottom: var(--a-spacing-4);
  }
`;

const StyledSection = styled.section`
  margin-bottom: var(--a-spacing-8);
`;

const BoksMedMargin = styled.div`
  margin-top: var(--a-spacing-4);
  margin-bottom: var(--a-spacing-4);
`;

const StyledAlert = styled(Alert)`
  margin-bottom: var(--a-spacing-11);
`;

export function Kvittering({ kvprops }: KvitteringsProps) {
  const { t } = useTranslation();

  const { soknad } = useVedleggslisteContext();

  return (
    <div>
      <Heading as="p" size="large" spacing data-cy="kvitteringOverskrift">
        {t('kvittering.tittel')}
      </Heading>
      <StyledSection aria-labelledby="mottattDokumenterHeading">
        <Heading id="mottattDokumenterHeading" spacing size="medium" level="2">
          {t(
            'kvittering.mottattDokumenter',

            {
              dato: formatertDato(new Date(kvprops.mottattdato)),
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
              </Alert>
              <BoksMedMargin>
                <LastNedKnapp url={`${publicRuntimeConfig.apiUrl}/${kvprops.hoveddokumentRef}`} variant="primary">
                  {t('kvittering.skjemaLenke')}
                </LastNedKnapp>
              </BoksMedMargin>
            </li>
          )}
          {kvprops &&
            kvprops.innsendteVedlegg &&
            kvprops.innsendteVedlegg.length > 0 &&
            kvprops.innsendteVedlegg.map((vedlegg) => {
              return (
                <li key={vedlegg.vedleggsnr}>
                  <Alert variant="success" size="medium" inline>
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
      </StyledSection>

      {kvprops.skalEttersendes && kvprops.skalEttersendes.length > 0 && (
        <StyledSection aria-labelledby="maaEttersendesHeading">
          <Heading id={'maaEttersendesHeading'} spacing size="medium" level="2">
            {t('kvittering.maaEttersendes')}
          </Heading>

          <BodyShort as="ul" size="medium" spacing>
            {kvprops.skalEttersendes.map((vedlegg) => {
              return <li key={vedlegg.vedleggsnr}> {vedlegg.tittel}</li>;
            })}
          </BodyShort>
        </StyledSection>
      )}

      {kvprops.skalSendesAvAndre && kvprops.skalSendesAvAndre.length > 0 && (
        <StyledSection aria-labelledby="sendesAvAndreHeading">
          <Heading id={'sendesAvAndreHeading'} spacing size="medium" level="2">
            {t('kvittering.sendesAvAndre')}
          </Heading>

          <BodyShort as="ul" size="medium" spacing>
            {kvprops.skalSendesAvAndre.map((vedlegg) => {
              return <li key={vedlegg.vedleggsnr}> {vedlegg.tittel}</li>;
            })}
          </BodyShort>
        </StyledSection>
      )}

      {kvprops.skalEttersendes && kvprops.skalEttersendes.length > 0 && (
        <>
          <StyledAlert variant="info">
            <Heading level={'3'} spacing size="small">
              {t('kvittering.fristEttersending', {
                dato: formatertDato(new Date(kvprops.ettersendingsfrist)),
              })}
            </Heading>
            <BodyLong>{t('kvittering.ettersendingsInfo')}</BodyLong>
          </StyledAlert>
        </>
      )}
      {!kvprops.skalEttersendes.length && !kvprops.skalSendesAvAndre.length && <StyledAlert variant="info">{t('kvittering.altMottatInfo')}</StyledAlert>}
      {!kvprops.skalEttersendes.length && kvprops.skalSendesAvAndre.length && kvprops.skalSendesAvAndre.length > 0 && <StyledAlert variant="info">{t('kvittering.manglerInnsendtAvAndre')}</StyledAlert>}
      <Button as="a" href={process.env.NEXT_PUBLIC_MIN_SIDE_URL} variant="secondary" size="medium">
        {t('kvittering.minSideKnapp')}
      </Button>
      <KvitteringsTillegg skjemanr={soknad.skjemanr} />
    </div>
  );
}

export default Kvittering;
