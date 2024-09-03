import { Alert, BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import { TFunction } from 'i18next';
import getConfig from 'next/config';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InnsendtVedleggDto, KvitteringsDto, VisningsType } from '../types/types';
import { formatertDato } from '../utils/dato';
import { KvitteringsTillegg } from './KvitteringsTillegg';
import { useVedleggslisteContext } from './VedleggsListe';
import { LastNedKnapp } from './common/LastNedKnapp';
import { Bold } from './textStyle';

const { publicRuntimeConfig } = getConfig();
export interface KvitteringsProps {
  kvprops: KvitteringsDto;
  visningstype: VisningsType;
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

const StyledButtonContainer = styled.div`
  margin-bottom: var(--a-spacing-11);
`;

function ettersendingsTekst({ kvprops, t }: { kvprops: KvitteringsDto; t: TFunction }) {
  if (kvprops.skalEttersendes.length && kvprops.skalEttersendes.length > 0 && !kvprops.skalSendesAvAndre.length)
    return t('kvittering.ettersendingsInfo');
  else if (kvprops.skalSendesAvAndre.length && kvprops.skalSendesAvAndre.length > 0 && !kvprops.skalEttersendes.length)
    return t('kvittering.manglerInnsendtAvAndre');
  else if (
    kvprops.skalEttersendes.length &&
    kvprops.skalEttersendes.length > 0 &&
    kvprops.skalSendesAvAndre.length &&
    kvprops.skalSendesAvAndre.length > 0
  )
    return t('kvittering.manglerInnsendingAvSelvOgAndre');
  else return '';
}

const VedleggsGruppe = ({ vedleggsGruppe, tittel }: { vedleggsGruppe: InnsendtVedleggDto[]; tittel: string }) => {
  const id = useId();
  return (
    <>
      {vedleggsGruppe && vedleggsGruppe.length > 0 && (
        <StyledSection aria-labelledby={id}>
          <Heading id={id} spacing size="medium" level="2">
            {tittel}
          </Heading>

          <BodyShort as="ul" size="medium" spacing>
            {vedleggsGruppe.map((vedlegg) => {
              return <li key={vedlegg.vedleggsnr}> {vedlegg.tittel}</li>;
            })}
          </BodyShort>
        </StyledSection>
      )}
    </>
  );
};

export default function Kvittering({ kvprops, visningstype }: KvitteringsProps) {
  const { t } = useTranslation();

  const { fyllutForm } = useVedleggslisteContext();

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
          {kvprops?.hoveddokumentRef && (
            <li>
              <Alert variant="success" size="medium" inline>
                {visningstype !== 'lospost' && (
                  <Bold>
                    {t('kvittering.skjema')}
                    {': '}
                  </Bold>
                )}
                {kvprops.label}
              </Alert>
              {visningstype !== 'lospost' && (
                <BoksMedMargin>
                  <LastNedKnapp url={`${publicRuntimeConfig.apiUrl}/${kvprops.hoveddokumentRef}`} variant="primary">
                    {t('kvittering.skjemaLenke')}
                  </LastNedKnapp>
                </BoksMedMargin>
              )}
            </li>
          )}
          {kvprops?.innsendteVedlegg?.map((vedlegg) => {
            return (
              <li key={vedlegg.vedleggsnr}>
                <Alert variant="success" size="medium" inline>
                  {visningstype !== 'lospost' && (
                    <Bold>
                      {t('kvittering.vedlegg')}
                      {': '}
                    </Bold>
                  )}
                  {vedlegg.tittel}
                </Alert>
              </li>
            );
          })}
        </SjekkBoksListe>
      </StyledSection>

      <VedleggsGruppe vedleggsGruppe={kvprops.skalEttersendes} tittel={t('kvittering.maaEttersendes')} />
      <VedleggsGruppe vedleggsGruppe={kvprops.levertTidligere} tittel={t('kvittering.levertTidligere')} />
      <VedleggsGruppe vedleggsGruppe={kvprops.sendesIkkeInn} tittel={t('kvittering.sendesIkkeInn')} />
      <VedleggsGruppe vedleggsGruppe={kvprops.skalSendesAvAndre} tittel={t('kvittering.sendesAvAndre')} />
      <VedleggsGruppe vedleggsGruppe={kvprops.navKanInnhente} tittel={t('kvittering.navKanInnhente')} />

      {((kvprops.skalEttersendes && kvprops.skalEttersendes.length > 0) ||
        (kvprops.skalSendesAvAndre && kvprops.skalSendesAvAndre.length > 0)) && (
        <>
          <StyledAlert variant="info">
            <Heading level={'3'} spacing size="small">
              {t('kvittering.fristEttersending', {
                dato: formatertDato(new Date(kvprops.ettersendingsfrist)),
              })}
            </Heading>
            <BodyLong>{ettersendingsTekst({ kvprops, t })}</BodyLong>
          </StyledAlert>
        </>
      )}
      {!kvprops.skalEttersendes.length && !kvprops.skalSendesAvAndre.length && (
        <StyledAlert variant="info">{t('kvittering.altMottatInfo')}</StyledAlert>
      )}

      <StyledButtonContainer>
        <Button as="a" href={process.env.NEXT_PUBLIC_MIN_SIDE_URL} variant="secondary" size="medium">
          {t('kvittering.minSideKnapp')}
        </Button>
      </StyledButtonContainer>

      <KvitteringsTillegg
        uxSignalsId={fyllutForm?.properties?.uxSignalsId}
        uxSignalsInnsending={fyllutForm?.properties?.uxSignalsInnsending}
      />
    </div>
  );
}
