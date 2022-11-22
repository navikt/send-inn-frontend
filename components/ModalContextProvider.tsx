import { Modal, Button, BodyLong, Heading } from '@navikt/ds-react';
import {
    useState,
    createContext,
    useCallback,
    useContext,
} from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FellesModal } from './FellesModal';
import { formatertDato } from './Kvittering';
import { VedleggslisteContext } from './VedleggsListe';

export function toUkerFraDato(date: Date) {
    const numberOfDaysToAdd = 7 * 2; // 7 dager * 6 uker
    return new Date(date.setDate(date.getDate() + numberOfDaysToAdd));
}

const ButtonRow = styled.div`
    padding-top: 37px;
    display: flex;
    justify-content: center;
    button {
        margin: 0 12px;
    }
`;

const tilMinSide = () => {
    console.log('TilMinSide');
    window.location.assign(process.env.NEXT_PUBLIC_MIN_SIDE_URL);
};

const StyledContent = styled(Modal.Content)`
    > *:first-child {
        margin-right: 36px;
    }

    ol,
    ul {
        padding-left: 1.75rem;
    }
    @media only screen and (max-width: 600px) {
        ol,
        ul {
            padding-left: 1.5rem;
        }
    }
`;
interface ModalContextProviderProps {
    children?: React.ReactNode;
}

interface ModalContextType {
    openForstettSenereSoknadModal: () => void;
    openSlettSoknadModal: () => void;
    openSendInnUferdigSoknadModal: () => void;
    openSendInnKomplettSoknadModal: () => void;
}

export const ModalContext = createContext<ModalContextType>(null);

export const ModalContextProvider = ({
    children,
}: ModalContextProviderProps) => {
    const { t } = useTranslation();

    const { soknad, onSendInn, slettSoknad } = useContext(
        VedleggslisteContext,
    );

    const [fortsettSenereSoknadModal, setForstettSenereSoknadModal] =
        useState(false);
    const [slettSoknadModal, setSlettSoknadModal] = useState(false);
    const [sendInnUferdigSoknadModal, setSendInnUferdigSoknadModal] =
        useState(false);
    const [
        sendInnKomplettSoknadModal,
        setSendInnKomplettSoknadModal,
    ] = useState(false);

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
                onAccept={tilMinSide}
                acceptButtonText={t('modal.fortsettSenere.accept')}
                cancelButtonText={t('modal.fortsettSenere.cancel')}
            >
                <Heading spacing size="medium">
                    {t('modal.fortsettSenere.tittel')}
                </Heading>
                <BodyLong as="ul">
                    {t('modal.fortsettSenere.liste', {
                        returnObjects: true,
                    }).map((element, key) => (
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
            >
                <Heading spacing size="medium">
                    {t('modal.slett.tittel')}
                </Heading>
                <BodyLong as="ul">
                    {t('modal.slett.liste', {
                        returnObjects: true,
                    }).map((element, key) => (
                        <li key={key}>{element}</li>
                    ))}
                </BodyLong>
            </FellesModal>

            <FellesModal
                open={sendInnUferdigSoknadModal}
                setOpen={setSendInnUferdigSoknadModal}
                onAccept={onSendInn}
                acceptButtonText={t('modal.sendInnUferdig.accept')}
                cancelButtonText={t('modal.sendInnUferdig.cancel')}
            >
                <Heading spacing size="medium">
                    {t('modal.sendInnUferdig.tittel')}
                </Heading>
                <BodyLong as="ul">
                    {t('modal.sendInnUferdig.liste', {
                        dato: formatertDato(
                            toUkerFraDato(
                                new Date(soknad.opprettetDato),
                            ),
                        ),
                        returnObjects: true,
                    }).map((element, key) => (
                        <li key={key}>{element}</li>
                    ))}
                </BodyLong>
            </FellesModal>

            <FellesModal
                open={sendInnKomplettSoknadModal}
                setOpen={setSendInnKomplettSoknadModal}
                onAccept={onSendInn}
                acceptButtonText={t('modal.sendInnKomplett.accept')}
                cancelButtonText={t('modal.sendInnKomplett.cancel')}
            >
                <Heading spacing size="medium">
                    {t('modal.sendInnKomplett.tittel')}
                </Heading>
                <BodyLong as="ul">
                    {t('modal.sendInnKomplett.liste', {
                        returnObjects: true,
                    }).map((element, key) => (
                        <li key={key}>{element}</li>
                    ))}
                </BodyLong>
            </FellesModal>
        </ModalContext.Provider>
    );
};
