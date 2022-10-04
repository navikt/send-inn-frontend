import { Modal } from '@navikt/ds-react';
import { useState, createContext, useEffect } from 'react';

interface ErrorMessageProviderProps {
    children?: React.ReactNode;
}

export const ErrorContext = createContext(null);

export const ErrorMessageProvider = ({
    children,
}: ErrorMessageProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

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
                    <h1>{message}</h1>
                </Modal.Content>
            </Modal>
        </ErrorContext.Provider>
    );
};
