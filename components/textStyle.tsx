import { ErrorMessage } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

export const Bold = styled.span`
    font-weight: 600;
`;

export const ErrorMessageWithDot = styled(ErrorMessage)`
    display: flex;
    gap: var(--a-spacing-2);
    &::before {
        content: '•';
    }
`;

export const ScreenReaderOnly = ({
    className = '',
    children,
    ...rest
}: React.ComponentPropsWithoutRef<'span'>) => {
    const mergedClassNames =
        (className ? className + ' ' : '') + 'navds-sr-only';
    return (
        <span className={mergedClassNames} {...rest}>
            {children}
        </span>
    );
};
