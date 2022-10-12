import { useContext, useEffect, useMemo } from 'react';
import { ValideringsContext } from '../components/SideValideringProvider';

import { v4 as uuidv4 } from 'uuid';

interface UseValidationProps {
    harFeil: boolean;
    komponentId: string;
    melding: string;
}

export const useValidation = ({
    harFeil,
    komponentId,
    melding,
}: UseValidationProps) => {
    const { lagreValidering, slettValidering, visValideringsfeil } =
        useContext(ValideringsContext);

    const valideringsId = useMemo<string>(uuidv4, []);

    useEffect(() => {
        lagreValidering({
            harFeil,
            komponentId,
            melding,
            valideringsId,
        });
        return () => {
            slettValidering({
                harFeil,
                komponentId,
                melding,
                valideringsId,
            });
        };
    }, [
        harFeil,
        komponentId,
        melding,
        lagreValidering,
        slettValidering,
        valideringsId,
    ]);

    return [
        visValideringsfeil && harFeil,
        melding,
        valideringsId,
    ] as const;
};
