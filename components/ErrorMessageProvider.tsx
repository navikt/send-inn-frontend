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

export const ErrorContext = createContext(null);

export const ErrorMessageProvider = ({
    children,
}: ErrorMessageProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();

    const value = {
        open,
        setOpen,
        message,
        setMessage,
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setMessage('');
                }}
            >
                <Modal.Content>
                    <StyledContent>
                        <Heading spacing size="medium">
                            {t('feil.advarselOverskrift')}
                        </Heading>

                        <BodyLong>{message}</BodyLong>
                        <ButtonRow>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={() => setOpen(false)}
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
