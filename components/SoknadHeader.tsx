import { Detail, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import '@navikt/ds-css';

export interface SoknadHeaderProps {
    soknadoverskrift: string;
    skjemanr: string;
}

export const StyledDetail = styled(Detail)`
    /*color: gray-900;

 var(
            --navds-semantic-color-text
        );
        
        */
    color: #4f4f4f;
    border-bottom-width: 20px;
    border-bottom-color: #99c4dd;
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

            <StyledDetail uppercase>
                {
                    skjemanr // navGra80
                }
            </StyledDetail>
        </div>
    );
}
