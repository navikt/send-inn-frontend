import { Alert } from '@navikt/ds-react';
import axios from 'axios';
import getConfig from 'next/config';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { OpplastingsStatus, PatchVedleggDto, VedleggType } from '../types/types';
import { hentVedleggsValgAlternativer, mapOpplastingStatusToVedleggsvalg } from '../utils/vedleggsValgUtils';
import { useLagringsProsessContext } from './LagringsProsessProvider';
import VedleggRadio from './VedleggRadio';
import { VedleggsKommentar } from './VedleggsKommentar';
import { useVedleggslisteContext } from './VedleggsListe';

const { publicRuntimeConfig } = getConfig();

const StyledVedleggsValg = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:not(:last-child) {
    padding-bottom: 1.5rem;
  }
`;
interface VedleggsValgProp {
  id: number;
  vedlegg: VedleggType;
  harOpplastetFil: boolean;
  valgtOpplastingStatus: OpplastingsStatus;
  setValgtOpplastingStatus: React.Dispatch<React.SetStateAction<OpplastingsStatus>>;
}

function VedleggsValg({
  id,
  vedlegg,
  harOpplastetFil,
  valgtOpplastingStatus,
  setValgtOpplastingStatus,
}: VedleggsValgProp) {
  const { t } = useTranslation();
  const { showError } = useErrorMessage();
  const controller = useRef(new AbortController());
  const kommentarController = useRef(new AbortController());

  const [kommentar, setKommentar] = useState(vedlegg.opplastingsValgKommentar || '');

  const { soknad, oppdaterLokalOpplastingStatus, fyllutForm } = useVedleggslisteContext();
  const { nyLagringsProsess } = useLagringsProsessContext();

  const fyllutAttachment = fyllutForm?.attachments.find((attachment) => attachment.label === vedlegg.label);
  const valgAlternativer = hentVedleggsValgAlternativer(fyllutAttachment?.attachmentValues);

  const vedleggsvalg = mapOpplastingStatusToVedleggsvalg(valgtOpplastingStatus);
  const currentAlternativ = valgAlternativer.find(({ key }) => key === vedleggsvalg);

  const avbrytOppdatering = useCallback(() => {
    controller.current.abort();
    kommentarController.current.abort();
    controller.current = new AbortController();
    kommentarController.current = new AbortController();
  }, []);

  const avbrytKommentarOppdatering = useCallback(() => {
    kommentarController.current.abort();
    kommentarController.current = new AbortController();
  }, []);

  const PatchVedlegg = useCallback(
    (body: PatchVedleggDto, signal: AbortSignal) => {
      return nyLagringsProsess(
        axios.patch<VedleggType>(
          `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${id}`,
          body,
          {
            timeout: 10000,
            signal,
          },
        ),
      );
    },
    [soknad.innsendingsId, id, nyLagringsProsess],
  );

  const oppdaterOpplastingStatus = useCallback(
    (nyOpplastingsStatus: OpplastingsStatus) => {
      const nyttVedleggsvalg = mapOpplastingStatusToVedleggsvalg(nyOpplastingsStatus);
      const nyttValgAlternativ = valgAlternativer.find(({ key }) => key === nyttVedleggsvalg);
      PatchVedlegg(
        {
          opplastingsStatus: nyOpplastingsStatus,
          ...(nyttValgAlternativ?.additionalDocumentationLabel
            ? {
                opplastingsValgKommentar: kommentar,
                opplastingsValgKommentarLedetekst: nyttValgAlternativ?.additionalDocumentationLabel,
              }
            : {}),
        },
        controller.current.signal,
      )
        .then((response) => {
          oppdaterLokalOpplastingStatus(id, response.data.opplastingsStatus);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            // avbrutt
            return;
          }
          setValgtOpplastingStatus(vedlegg.opplastingsStatus);
          showError(error);
        });
    },
    [
      id,
      vedlegg.opplastingsStatus,
      setValgtOpplastingStatus,
      oppdaterLokalOpplastingStatus,
      showError,
      PatchVedlegg,
      kommentar,
      valgAlternativer,
    ],
  );

  const oppdaterKommentar = useCallback(
    (nyKommentar: string) => {
      PatchVedlegg(
        {
          opplastingsValgKommentar: nyKommentar,
          opplastingsValgKommentarLedetekst: currentAlternativ?.additionalDocumentationLabel,
        },
        kommentarController.current.signal,
      ).catch((error) => {
        if (axios.isCancel(error)) {
          // avbrutt
          return;
        }
        showError(error);
      });
    },
    [showError, PatchVedlegg, currentAlternativ],
  );

  return (
    <StyledVedleggsValg>
      {valgAlternativer.length === 1 && valgAlternativer[0].key === 'LasterOpp' ? (
        <Alert variant="info" inline>
          {t('soknad.vedlegg.paakrevd')}
        </Alert>
      ) : (
        <VedleggRadio
          label={vedlegg.label}
          harOpplastetFil={harOpplastetFil}
          vedleggsvalg={vedleggsvalg}
          valgAlternativer={valgAlternativer}
          oppdaterOpplastingStatus={oppdaterOpplastingStatus}
          setValgtOpplastingStatus={setValgtOpplastingStatus}
          avbrytOppdatering={avbrytOppdatering}
        />
      )}

      {currentAlternativ?.additionalDocumentationLabel && (
        <VedleggsKommentar
          vedleggsId={id}
          label={currentAlternativ.additionalDocumentationLabel}
          description={currentAlternativ.additionalDocumentationDescription}
          kommentar={kommentar}
          setKommentar={setKommentar}
          oppdaterKommentar={oppdaterKommentar}
          avbrytOppdatering={avbrytKommentarOppdatering}
        />
      )}
      {currentAlternativ?.deadlineWarning && (
        <Alert variant="warning" inline>
          {currentAlternativ?.deadlineWarning}
        </Alert>
      )}
    </StyledVedleggsValg>
  );
}

export default VedleggsValg;
