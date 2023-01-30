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
        border: 1px solid var(--navds-text-field-color-border-error);
        box-shadow: 0 0 0 1px
            var(--navds-text-field-color-border-error);
        border-radius: 8px;

        :hover {
            border-color: var(--navds-text-field-color-border-hover);
        }
        :focus {
            box-shadow: 0 0 0 1px
                    var(--navds-text-field-color-border-error),
                var(--navds-shadow-focus);
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
