import { ErrorMessage } from '@navikt/ds-react';
import styled from 'styled-components';

export const Bold = styled.span`
    font-weight: 600;
`;

export const ErrorMessageWithDot = styled(ErrorMessage)`
    display: flex;
    gap: var(--a-spacing-2);
    ::before {
        content: '•';
    }
`;

export const ScreenReaderOnly = styled.span`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;
