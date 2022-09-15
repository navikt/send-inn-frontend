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
    padding-top: 24px;
    padding-bottom: 24px;
`;

export function SoknadHeader({
    soknadoverskrift,
    skjemanr,
}: SoknadHeaderProps) {
    return (
        <Style>
            <div>
                <Heading level="1" size="xlarge">
                    {soknadoverskrift}
                </Heading>
                <StyledDetail size="small" uppercase>
                    {skjemanr}
                </StyledDetail>
            </div>
        </Style>
    );
}
