import { Modal, Button, BodyLong, Heading } from '@navikt/ds-react';
import { useState, createContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ButtonRow = styled.div`
    padding-top: 37px;
    display: flex;
    justify-content: center;
    button {
        margin: 0 12px;
    }
`;

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

interface ErrorMessageProviderProps {
    children?: React.ReactNode;
}

export type ErrorMessageType = {
    message: string;
    title?: string;
};
interface ErrorContextType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    error: ErrorMessageType;
    setError: React.Dispatch<React.SetStateAction<ErrorMessageType>>;
}

export const ErrorContext = createContext<ErrorContextType>(null);

export const ErrorMessageProvider = ({
    children,
}: ErrorMessageProviderProps) => {
    const { t } = useTranslation();
    const defaultTitle = t('feil.advarselOverskrift');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<ErrorMessageType>({
        message: '',
        title: null,
    });

    const value = {
        open,
        setOpen,
        error,
        setError,
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}

            <Modal open={open} onClose={onClose}>
                <Modal.Content>
                    <StyledContent>
                        <Heading spacing size="medium">
                            {error.title || defaultTitle}
                        </Heading>

                        <BodyLong>{error.message}</BodyLong>
                        <ButtonRow>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={onClose}
                            >
                                {t('feil.advarselBrukerBekreftelse')}
                            </Button>
                        </ButtonRow>
                    </StyledContent>
                </Modal.Content>
            </Modal>
        </ErrorContext.Provider>
    );
};
