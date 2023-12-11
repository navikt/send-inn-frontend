import { BodyShort, Heading, Ingress } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FIL_STATUS } from '../types/enums';
import { VedleggType } from '../types/types';
import { FilePanel } from './Fil';
import { FilUploadIcon } from './FilUploadIcon';
import { FilMottattFelt, VedleggPanel } from './Vedlegg';
import { Linje } from './common/Linje';

interface AndreVedleggProps {
  vedleggsliste: VedleggType[];
}

const VedleggContainer = styled.div`
  margin-top: 60px;
`;

const AndreVedlegg = (props: AndreVedleggProps) => {
  const { t } = useTranslation();

  return (
    <VedleggContainer>
      <Heading level={'3'} size="large" spacing>
        {t('soknad.visningsSteg.lastOppVedlegg.andreVedleggTittel')}
      </Heading>
      <Ingress spacing>{t('soknad.visningsSteg.lastOppVedlegg.andreVedleggIngress')}</Ingress>
      <Linje />

      <VedleggPanel>
        <Heading level={'4'} size="xsmall" spacing>
          {t('soknad.vedlegg.tidligereLastetOpp')}
        </Heading>

        {/* Vedlegg som er lastet opp, men som ikke lenger er relevante for innsendingen av søknaden. Dette kan skje hvis bruker endrer søknaden i fyllut slik at vedlegget ikke lenger er nødvendig. Filene blir slettet når bruker sender inn søknaden. */}

        {props.vedleggsliste
          .filter((x) => x.opplastingsStatus === 'LastetOppIkkeRelevantLenger')
          .map((vedlegg) => (
            <div key={vedlegg.id}>
              <FilePanel border>
                <div className="icon">
                  <FilUploadIcon filstatus={FIL_STATUS.TIDLIGERE_LASTET_OPP} filnavn={vedlegg.label} />
                </div>

                <BodyShort className="filename">{vedlegg.label}</BodyShort>

                <div className="hoyreHalvdel">
                  <FilMottattFelt>
                    <BodyShort>{t('soknad.vedlegg.lastetOpp')}</BodyShort>
                    <BodyShort>
                      {new Date(vedlegg.opprettetdato!).toLocaleString('no', {
                        dateStyle: 'short',
                      })}
                    </BodyShort>
                  </FilMottattFelt>
                </div>
              </FilePanel>
            </div>
          ))}
      </VedleggPanel>
    </VedleggContainer>
  );
};

export default AndreVedlegg;
