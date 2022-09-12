import { Detail, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import '@navikt/ds-css';

export interface SoknadHeaderProps {
    soknadoverskrift: string;
    skjemanr: string;
}

export const StyledDetail = styled(Detail)`
    color: var(--navds-global-color-gray-900);
`;

export const Style = styled.div`
    > * {
        max-width: 60rem;
    }

    align-items: center;
    display: flex;
    flex-direction: column;
    border-bottom: 0.3rem solid var(--navds-global-color-deepblue-200);
`;

export function SoknadHeader({
    soknadoverskrift,
    skjemanr,
}: SoknadHeaderProps) {
    return (
        <Style>
            <div>
                <Heading level="1" size="large">
                    {soknadoverskrift}
                </Heading>
                <StyledDetail uppercase="true">
                    {skjemanr}
                </StyledDetail>
            </div>
        </Style>
    );
}
