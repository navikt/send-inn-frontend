import { ErrorMessage } from '@navikt/ds-react';
import styled from 'styled-components';

export const Bold = styled.span`
    font-weight: 600;
`;

export const ErrorMessageWithDot = styled(ErrorMessage)`
    display: flex;
    gap: var(--navds-spacing-2);
    ::before {
        content: '•';
    }
`;
