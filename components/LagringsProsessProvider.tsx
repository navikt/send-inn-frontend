import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
} from 'react';
import { useState } from 'react';

interface LagringsProsessProviderProps {
    children?: React.ReactNode;
}

interface LagringsProsessContextType {
    lagrer: boolean;
    lagrerNaa: () => boolean;
    ventPaaLagring: () => Promise<void>;
    nyLagringsProsess: <T>(promise: Promise<T>) => Promise<T>;
}

const LagringsProsessContext =
    createContext<LagringsProsessContextType | null>(null);

export const useLagringsProsessContext = () => {
    const lagringsProsessContext = useContext(LagringsProsessContext);
    if (!lagringsProsessContext) {
        throw new Error(
            'Mangler LagringsProsessProvider, når useLagringsProsessContext kalles',
        );
    }
    return lagringsProsessContext;
};

export const LagringsProsessProvider = ({
    children,
}: LagringsProsessProviderProps) => {
    const [aktiveLagringsProsesser, setAktiveLagringsProsesser] =
        useState<Promise<unknown>[]>([]);
    const aktiveLagringsProsesserRef = useRef<Promise<unknown>[]>([]);

    const leggTilLagringsProsess = useCallback(
        <T,>(promise: Promise<T>) => {
            setAktiveLagringsProsesser((a) => {
                const nyListe = [...a, promise];
                aktiveLagringsProsesserRef.current = nyListe;
                return nyListe;
            });
        },
        [],
    );
    const fjernLagringsProsess = useCallback(
        <T,>(promise: Promise<T>) => {
            setAktiveLagringsProsesser((a) => {
                const nyListe = a.filter((p) => p !== promise);
                aktiveLagringsProsesserRef.current = nyListe;
                return nyListe;
            });
        },
        [],
    );

    const nyLagringsProsess = useCallback(
        <T,>(promise: Promise<T>) => {
            leggTilLagringsProsess(promise);

            return promise.finally(() => {
                fjernLagringsProsess(promise);
            });
        },
        [leggTilLagringsProsess, fjernLagringsProsess],
    );

    const ventPaaLagring = useCallback(async () => {
        while (aktiveLagringsProsesserRef.current.length) {
            await Promise.all(aktiveLagringsProsesserRef.current);
        }
        return;
    }, []);

    const lagrerNaa = useCallback(() => {
        return aktiveLagringsProsesserRef.current.length !== 0;
    }, []);

    const lagrer = aktiveLagringsProsesser.length !== 0;

    return (
        <LagringsProsessContext.Provider
            value={{
                ventPaaLagring,
                nyLagringsProsess,
                lagrer,
                lagrerNaa,
            }}
        >
            {children}
        </LagringsProsessContext.Provider>
    );
};
