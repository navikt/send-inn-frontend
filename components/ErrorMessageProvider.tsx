import { BodyLong, Heading } from '@navikt/ds-react';
import { useState, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FellesModal } from './FellesModal';

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

    return (
        <ErrorContext.Provider value={value}>
            {children}

            <FellesModal
                open={open}
                setOpen={setOpen}
                cancelButtonText={t('feil.advarselBrukerBekreftelse')}
                cancelButtonVariant="secondary"
            >
                <Heading spacing size="medium">
                    {error.title || defaultTitle}
                </Heading>

                <BodyLong>{error.message}</BodyLong>
            </FellesModal>
        </ErrorContext.Provider>
    );
};
