import React from 'react';
import styled from 'styled-components';
import { ErrorMessageWithDot } from './textStyle';

interface ValideringsRammeProps {
    id: string;
    visFeil: boolean;
    melding: string;
    children?: React.ReactNode;
}

const FeilRamme = styled.div`
    &.visFeil {
        border: 1px solid var(--a-border-danger);
        box-shadow: 0 0 0 1px var(--a-border-danger);
        border-radius: 8px;

        :hover {
            border-color: var(--a-border-action);
        }
        :focus {
            box-shadow: 0 0 0 1px var(--a-border-danger),
                var(--a-shadow-focus);
        }
        margin-bottom: 0.5rem;
    }
`;

export const ValideringsRamme = ({
    id,
    visFeil,
    melding,
    children,
}: ValideringsRammeProps) => {
    return (
        <>
            <FeilRamme
                id={id}
                tabIndex={-1}
                className={visFeil ? 'visFeil' : ''}
            >
                {children}
            </FeilRamme>
            {visFeil && (
                <ErrorMessageWithDot>{melding}</ErrorMessageWithDot>
            )}
        </>
    );
};
