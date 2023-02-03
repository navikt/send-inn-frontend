import React, { createContext, useCallback, useRef } from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LagringsProsessProviderProps {
    children?: React.ReactNode;
}

interface LagringsProsessContextType {
    lagrer: boolean;
    ventPaaLagring: () => Promise<void>;
    nyLagringsProsess: <T>(promise: Promise<T>) => void;
}

export const LagringsProsessContext =
    createContext<LagringsProsessContextType>(null);

export const LagringsProsessProvider = ({
    children,
}: LagringsProsessProviderProps) => {
    const [aktiveLagringsProsesser, setAktiveLagringsProsesser] =
        useState<string[]>([]);
    const aktiveLagringsProsesserRef = useRef<string[]>([]);

    const leggTilLagringsProsess = useCallback(
        (nyOppdateringId: string) => {
            setAktiveLagringsProsesser((o) => {
                const nyListe = [...o, nyOppdateringId];
                aktiveLagringsProsesserRef.current = nyListe;
                return nyListe;
            });
        },
        [],
    );
    const fjernLagringsProsess = useCallback(
        (oppdateringId: string) => {
            setAktiveLagringsProsesser((o) => {
                const nyListe = o.filter(
                    (id) => id !== oppdateringId,
                );
                aktiveLagringsProsesserRef.current = nyListe;
                return nyListe;
            });
        },
        [],
    );

    const nyLagringsProsess = useCallback(
        <T,>(promise: Promise<T>) => {
            const oppdateringId = uuidv4();
            leggTilLagringsProsess(oppdateringId);

            promise.finally(() => {
                fjernLagringsProsess(oppdateringId);
            });
        },
        [leggTilLagringsProsess, fjernLagringsProsess],
    );

    const ventPaaLagring = async () => {
        while (aktiveLagringsProsesserRef.current.length) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return;
    };

    const lagrer = aktiveLagringsProsesser.length !== 0;

    return (
        <LagringsProsessContext.Provider
            value={{
                ventPaaLagring,
                nyLagringsProsess,
                lagrer,
            }}
        >
            {children}
        </LagringsProsessContext.Provider>
    );
};
