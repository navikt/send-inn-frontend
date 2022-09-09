import { Detail, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import '@navikt/ds-css';

export interface SoknadHeaderProps {
    soknadoverskrift: string;
    skjemanr: string;
}

export const StyledDetail = styled(Detail)`
    color: var(--navds-global-color-gray-900);
    border-bottom: 0.3rem solid var(--navds-global-color-deepblue-200);
`;

export function SoknadHeader({
    soknadoverskrift,
    skjemanr,
}: SoknadHeaderProps) {
    return (
        <div>
            <Heading level="1" size="large">
                {soknadoverskrift}
            </Heading>

            <StyledDetail uppercase>{skjemanr}</StyledDetail>
        </div>
    );
}
