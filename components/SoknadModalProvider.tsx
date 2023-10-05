import { BodyLong, Heading } from '@navikt/ds-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { datoOmXDager, formatertDato } from '../utils/dato';
import { navigerTilMinSide } from '../utils/navigerTilMinSide';
import { useErrorMessageContext } from './ErrorMessageProvider';
import { FellesModal } from './FellesModal';
import { useLagringsProsessContext } from './LagringsProsessProvider';
import { useVedleggslisteContext } from './VedleggsListe';

interface SoknadModalProviderProps {
  children?: React.ReactNode;
}

interface ModalContextType {
  openForstettSenereSoknadModal: () => void;
  openSlettSoknadModal: () => void;
  openSendInnUferdigSoknadModal: () => void;
  openSendInnKomplettSoknadModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    throw new Error('Mangler ErrorMessageProvider, når useModalContext kalles');
  }
  return modalContext;
};

export const SoknadModalProvider = ({ children }: SoknadModalProviderProps) => {
  const { t } = useTranslation();

  const { soknad, onSendInn, slettSoknad } = useVedleggslisteContext();
  const { lagrer } = useLagringsProsessContext();
  const { open: hasError } = useErrorMessageContext();

  const [fortsettSenereSoknadModal, setForstettSenereSoknadModal] = useState(false);
  const [slettSoknadModal, setSlettSoknadModal] = useState(false);
  const [sendInnUferdigSoknadModal, setSendInnUferdigSoknadModal] = useState(false);
  const [sendInnKomplettSoknadModal, setSendInnKomplettSoknadModal] = useState(false);

  if (
    hasError &&
    (fortsettSenereSoknadModal || slettSoknadModal || sendInnUferdigSoknadModal || sendInnKomplettSoknadModal)
  ) {
    setForstettSenereSoknadModal(false);
    setSlettSoknadModal(false);
    setSendInnUferdigSoknadModal(false);
    setSendInnKomplettSoknadModal(false);
  }

  const openForstettSenereSoknadModal = useCallback(() => {
    setForstettSenereSoknadModal(true);
  }, [setForstettSenereSoknadModal]);

  const openSlettSoknadModal = useCallback(() => {
    setSlettSoknadModal(true);
  }, [setSlettSoknadModal]);

  const openSendInnUferdigSoknadModal = useCallback(() => {
    setSendInnUferdigSoknadModal(true);
  }, [setSendInnUferdigSoknadModal]);

  const openSendInnKomplettSoknadModal = useCallback(() => {
    setSendInnKomplettSoknadModal(true);
  }, [setSendInnKomplettSoknadModal]);

  return (
    <ModalContext.Provider
      value={{
        openForstettSenereSoknadModal,
        openSlettSoknadModal,
        openSendInnUferdigSoknadModal,
        openSendInnKomplettSoknadModal,
      }}
    >
      {children}

      <FellesModal
        open={fortsettSenereSoknadModal}
        setOpen={setForstettSenereSoknadModal}
        onAccept={navigerTilMinSide}
        acceptButtonText={t('modal.fortsettSenere.accept')}
        cancelButtonText={t('modal.fortsettSenere.cancel')}
      >
        <Heading spacing size="medium">
          {t('modal.fortsettSenere.tittel')}
        </Heading>
        <BodyLong as="ul">
          {(
            t('modal.fortsettSenere.liste', {
              returnObjects: true,
            }) as string[]
          ).map((element, key) => (
            <li key={key}>{element}</li>
          ))}
        </BodyLong>
      </FellesModal>

      <FellesModal
        open={slettSoknadModal}
        setOpen={setSlettSoknadModal}
        onAccept={slettSoknad}
        acceptButtonText={t('modal.slett.accept')}
        cancelButtonText={t('modal.slett.cancel')}
        isLoading={lagrer}
      >
        <Heading spacing size="medium">
          {t('modal.slett.tittel')}
        </Heading>
        <BodyLong as="ul">
          {(
            t('modal.slett.liste', {
              returnObjects: true,
            }) as string[]
          ).map((element, key) => (
            <li key={key}>{element}</li>
          ))}
        </BodyLong>
      </FellesModal>

      <FellesModal
        open={sendInnUferdigSoknadModal}
        setOpen={setSendInnUferdigSoknadModal}
        onAccept={async () => {
          await onSendInn();
          setSendInnUferdigSoknadModal(false);
        }}
        acceptButtonText={t('modal.sendInnUferdig.accept')}
        cancelButtonText={t('modal.sendInnUferdig.cancel')}
        isLoading={lagrer}
      >
        <Heading spacing size="medium">
          {t('modal.sendInnUferdig.tittel')}
        </Heading>
        <BodyLong as="ul">
          {(
            t('modal.sendInnUferdig.liste', {
              dato: formatertDato(
                soknad.visningsType === 'ettersending'
                  ? new Date(soknad.innsendingsFristDato)
                  : datoOmXDager(soknad.fristForEttersendelse),
              ),

              returnObjects: true,
            }) as string[]
          ).map((element, key) => (
            <li key={key}>{element}</li>
          ))}
        </BodyLong>
      </FellesModal>

      <FellesModal
        open={sendInnKomplettSoknadModal}
        setOpen={setSendInnKomplettSoknadModal}
        onAccept={async () => {
          await onSendInn();
          setSendInnKomplettSoknadModal(false);
        }}
        acceptButtonText={t('modal.sendInnKomplett.accept')}
        cancelButtonText={t('modal.sendInnKomplett.cancel')}
        isLoading={lagrer}
      >
        <Heading spacing size="medium">
          {t('modal.sendInnKomplett.tittel')}
        </Heading>
        <BodyLong as="ul">
          {(
            t('modal.sendInnKomplett.liste', {
              returnObjects: true,
            }) as string[]
          ).map((element, key) => (
            <li key={key}>{element}</li>
          ))}
        </BodyLong>
      </FellesModal>
    </ModalContext.Provider>
  );
};
