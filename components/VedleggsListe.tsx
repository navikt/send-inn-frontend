import axios from 'axios';
import getConfig from 'next/config';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import Kvittering, { KvitteringsDto } from '../components/Kvittering';
import SkjemaNedlasting from '../components/SkjemaNedlasting';
import { ExtendedVedleggType } from '../components/Vedlegg';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { FyllutForm } from '../types/fyllutForm';
import { OpplastingsStatus, SoknadType, VedleggType } from '../types/types';
import { navigerTilMinSide } from '../utils/navigerTilMinSide';
import { AutomatiskInnsending } from './AutomatiskInnsending';
import { useLagringsProsessContext } from './LagringsProsessProvider';
import LastOppVedlegg from './LastOppVedlegg';
import SkjemaOpplasting from './SkjemaOpplasting';
import { SoknadModalProvider } from './SoknadModalProvider';

const { publicRuntimeConfig } = getConfig();

const initialVedleggsliste: VedleggType[] = [];

const Style = styled.div`
  padding-top: 44px;
  margin-bottom: 44px;
  outline: none;
  max-width: 50rem;
`;

export interface VedleggsListeProps {
  soknad: SoknadType;
  setSoknad: React.Dispatch<React.SetStateAction<SoknadType | null>>;
  erEttersending: boolean;
  visningsSteg?: number;
  visningsType?: string;
}

const soknadErKomplett = (vedleggsliste: VedleggType[]): boolean =>
  vedleggsliste
    .filter((element) => element.erPakrevd === true)
    .every((element) => {
      return (
        element.opplastingsStatus === 'LastetOpp' ||
        element.opplastingsStatus === 'SendesAvAndre' ||
        element.opplastingsStatus === 'Innsendt'
      );
    });

const soknadKanSendesInn = (vedleggsliste: VedleggType[]): boolean =>
  vedleggsliste
    .filter((element) => element.erHoveddokument === true)
    .every((element) => element.opplastingsStatus === 'LastetOpp');

interface VedleggslisteContextType {
  soknad: SoknadType;
  soknadKlar: boolean;
  soknadDelvisKlar: boolean;
  onSendInn: () => Promise<void>;
  slettSoknad: () => void;
  oppdaterLokalOpplastingStatus: (id: number, opplastingsStatus: OpplastingsStatus) => void;
  leggTilVedlegg: (vedlegg: ExtendedVedleggType) => void;
  slettAnnetVedlegg: (vedleggId: number) => void;
  fyllutForm?: FyllutForm;
}

export const VedleggslisteContext = createContext<VedleggslisteContextType | null>(null);

export const useVedleggslisteContext = () => {
  const vedleggslisteContext = useContext(VedleggslisteContext);
  if (!vedleggslisteContext) {
    throw new Error('Mangler VedleggsListe -provider, når useVedleggslisteContext kalles');
  }
  return vedleggslisteContext;
};

function VedleggsListe({ soknad, setSoknad }: VedleggsListeProps) {
  const { data: fyllutForm } = useSWR(
    soknad?.visningsType === 'fyllUt'
      ? `${publicRuntimeConfig.basePath}/api/fyllut/forms/${soknad.skjemaPath}?type=limited&lang=${soknad.spraak}`
      : null,
  );

  const { showError } = useErrorMessage();
  const { lagrerNaa, nyLagringsProsess } = useLagringsProsessContext();

  const [vedleggsliste, setVedleggsListe] = useState<VedleggType[]>(soknad.vedleggsListe);

  const soknadKlar = useMemo(() => soknadErKomplett(vedleggsliste), [vedleggsliste]);
  const soknadDelvisKlar = useMemo(() => soknadKanSendesInn(vedleggsliste), [vedleggsliste]);

  const [visningsSteg, setVisningsSteg] = useState(soknad.visningsSteg);

  const [visKvittering, setVisKvittering] = useState(false);
  const [soknadsInnsendingsRespons, setSoknadsInnsendingsRespons] = useState<KvitteringsDto | null>(null);

  const { visningsType, kanLasteOppAnnet } = soknad;

  const vedleggsListeContainer = useRef<HTMLDivElement>(null);

  const erFraFyllutUtenVedlegg =
    !visKvittering &&
    visningsType === 'fyllUt' &&
    vedleggsliste.every((vedlegg) => vedlegg.erHoveddokument) &&
    !kanLasteOppAnnet;

  const visSteg0 =
    !visKvittering &&
    visningsType === 'dokumentinnsending' &&
    visningsSteg === 0 &&
    vedleggsliste.some((x) => x.erHoveddokument);

  const visSteg1 =
    !visKvittering &&
    visningsType === 'dokumentinnsending' &&
    visningsSteg === 1 &&
    vedleggsliste.some((x) => x.erHoveddokument);

  const visLastOppVedlegg =
    !visKvittering &&
    !erFraFyllutUtenVedlegg &&
    (visningsType !== 'dokumentinnsending' || (visningsType === 'dokumentinnsending' && visningsSteg === 2));

  const onSendInn = async () => {
    if (lagrerNaa()) return;

    await nyLagringsProsess(axios.post(`${publicRuntimeConfig.apiUrl}/frontend/v1/sendInn/${soknad?.innsendingsId}`))
      .then((response) => {
        const kv: KvitteringsDto = response.data;
        setSoknadsInnsendingsRespons(kv);
        setVisKvittering(true);
        resettFokus();
      })
      .catch((error) => {
        showError(error);
      });
  };

  const slettSoknad = () => {
    if (lagrerNaa()) return;

    nyLagringsProsess(axios.delete(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad?.innsendingsId}`))
      .then(() => {
        resetState();
        navigerTilMinSide();
      })
      .catch((error) => {
        showError(error);
      });
  };

  const resettFokus = () => {
    if (vedleggsListeContainer.current) {
      vedleggsListeContainer.current.focus();
      if (window.scrollY !== 0) {
        vedleggsListeContainer.current.scrollIntoView(true);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  const oppdaterVisningsSteg = (nr: number) => {
    const nyttVisningsSteg = visningsSteg + nr;
    setVisningsSteg(nyttVisningsSteg);
    resettFokus();

    axios
      .patch(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}`, {
        visningsSteg: nyttVisningsSteg,
      })
      .catch((error) => {
        showError(error);
      });
  };

  const oppdaterLokalOpplastingStatus = useCallback(
    (id: number, opplastingsStatus: OpplastingsStatus) => {
      setVedleggsListe((forrigeVedleggsliste) =>
        forrigeVedleggsliste.map((el) => (el.id === id ? { ...el, opplastingsStatus } : el)),
      );
    },
    [setVedleggsListe],
  );

  const leggTilVedlegg = (vedlegg: ExtendedVedleggType) => {
    setVedleggsListe((forrigeVedleggsliste) => [...forrigeVedleggsliste, vedlegg]);
  };
  const slettAnnetVedlegg = (vedleggsId: number) => {
    axios
      .delete(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${soknad.innsendingsId}/vedlegg/${vedleggsId}`)
      .then(() => {
        setVedleggsListe((forrigeVedleggsliste) => forrigeVedleggsliste.filter((el) => el.id !== vedleggsId));
      })
      .catch((error) => {
        showError(error);
      });
  };

  const resetState = () => {
    setVedleggsListe(initialVedleggsliste);
    setSoknad(null);
  };
  return (
    <VedleggslisteContext.Provider
      value={{
        soknad,
        soknadKlar,
        soknadDelvisKlar,
        onSendInn,
        slettSoknad,
        oppdaterLokalOpplastingStatus,
        leggTilVedlegg,
        slettAnnetVedlegg,
        fyllutForm,
      }}
    >
      <SoknadModalProvider>
        <Style ref={vedleggsListeContainer} tabIndex={-1}>
          {/* // Er fra Fyllut uten vedlegg */}
          {erFraFyllutUtenVedlegg && <AutomatiskInnsending />}
          {/* // skjemanedlasting, steg 1 */}
          {visSteg0 && (
            <SkjemaNedlasting
              vedlegg={vedleggsliste.find((x) => x.erHoveddokument)!}
              oppdaterVisningsSteg={oppdaterVisningsSteg}
            />
          )}

          {/* skjemaopplasting, steg 2*/}
          {visSteg1 && (
            <SkjemaOpplasting
              vedlegg={vedleggsliste.find((x) => x.erHoveddokument)!}
              soknad={soknad}
              oppdaterVisningsSteg={oppdaterVisningsSteg}
            />
          )}
          {/* vedleggssiden, steg 3 (eller 1) */}
          {visLastOppVedlegg && (
            <LastOppVedlegg vedleggsliste={vedleggsliste} oppdaterVisningsSteg={oppdaterVisningsSteg} />
          )}

          {/* steg 4 kvitteringsside  */}
          {visKvittering && <Kvittering kvprops={soknadsInnsendingsRespons!} />}
        </Style>
      </SoknadModalProvider>
    </VedleggslisteContext.Provider>
  );
}
export default VedleggsListe;
