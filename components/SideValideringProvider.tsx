import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';

import { ErrorSummary } from '@navikt/ds-react';

export interface SideValideringProps {
  setHarValideringsfeil: React.Dispatch<React.SetStateAction<boolean>>;
  visValideringsfeil: boolean;
  setVisValideringsfeil: React.Dispatch<React.SetStateAction<boolean>>;
  fokus: boolean;
  setFokus: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export interface ValideringsType {
  valideringsId: string;
  komponentId: string;
  harFeil: boolean;
  melding: string;
}

export const ACTIONS = {
  LAGRE: 'LAGRE',
  SLETT: 'SLETT',
} as const;

export interface ActionType {
  type: (typeof ACTIONS)[keyof typeof ACTIONS];
  validering: ValideringsType;
}

const vedleggReducer = (valideringer: ValideringsType[], action: ActionType) => {
  switch (action.type) {
    case ACTIONS.LAGRE: {
      const finnes = valideringer.some((validering) => validering.valideringsId === action.validering.valideringsId);

      if (finnes) {
        return valideringer.map((validering) =>
          validering.valideringsId === action.validering.valideringsId ? action.validering : validering,
        );
      }
      return [...valideringer, action.validering];
    }
    case ACTIONS.SLETT: {
      return valideringer.filter((validering) => validering.valideringsId !== action.validering.valideringsId);
    }
  }
};

const initialState: ValideringsType[] = [];

interface ValideringsContextType {
  lagreValidering: (validering: ValideringsType) => void;
  slettValidering: (validering: ValideringsType) => void;
  visValideringsfeil: boolean;
}

const ValideringsContext = createContext<ValideringsContextType | null>(null);

export const useValideringsContext = () => {
  const valideringsContext = useContext(ValideringsContext);
  if (!valideringsContext) {
    throw new Error('Mangler SideValideringProvider, når useValideringsContext kalles');
  }
  return valideringsContext;
};

export const SideValideringProvider = ({
  setHarValideringsfeil,
  visValideringsfeil,
  setVisValideringsfeil,
  fokus,
  setFokus,
  children,
}: SideValideringProps) => {
  const [valideringer, dispatch] = useReducer(vedleggReducer, initialState);

  const errorRef = useRef<HTMLDivElement>(null);

  const valideringsFeil = valideringer.filter((validering) => validering.harFeil);

  const harFeil = valideringsFeil.length !== 0;

  useEffect(() => {
    if (fokus) {
      errorRef?.current && errorRef.current.focus();
      setFokus(false);
    }
  }, [fokus, setFokus]);

  useEffect(() => {
    setHarValideringsfeil(harFeil);
    if (!harFeil) {
      setVisValideringsfeil(false);
    }
  }, [harFeil, setHarValideringsfeil, setVisValideringsfeil, setFokus]);

  const lagreValidering = useCallback((validering: ValideringsType) => {
    dispatch({ type: ACTIONS.LAGRE, validering });
  }, []);
  const slettValidering = useCallback((validering: ValideringsType) => {
    dispatch({ type: ACTIONS.SLETT, validering });
  }, []);
  return (
    <ValideringsContext.Provider
      value={{
        lagreValidering,
        slettValidering,
        visValideringsfeil,
      }}
    >
      {harFeil && visValideringsfeil && (
        <ErrorSummary heading="Du må fikse disse feilene før du kan sende inn søknad." ref={errorRef}>
          {valideringsFeil.map((validering) => (
            <ErrorSummary.Item key={validering.valideringsId} href={'#' + validering.komponentId}>
              {validering.melding}
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      )}
      {children}
    </ValideringsContext.Provider>
  );
};
