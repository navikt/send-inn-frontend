import '@navikt/ds-css';
import { BodyShort, Heading } from '@navikt/ds-react';
import styled from 'styled-components';

export interface SoknadHeaderProps {
  soknadoverskrift: string;
  skjemanr: string;
}

export const StyledDetail = styled(BodyShort)`
  color: var(--a-gray-900);
`;

export const Style = styled.div`
  & > * {
    max-width: 60rem;
    padding-left: 16px;
    padding-right: 16px;
  }

  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  margin-left: -16px;
  margin-right: -16px;
  width: 100vw;
`;

export const Line = styled.div`
  width: 100vw;
  border-bottom: 0.3rem solid var(--a-deepblue-200);
  margin-left: calc(50% - 50vw);
`;

export function SoknadHeader({ soknadoverskrift, skjemanr }: SoknadHeaderProps) {
  return (
    <>
      <Style>
        <div>
          <Heading level="1" size="xlarge">
            {soknadoverskrift}
          </Heading>
          <StyledDetail>{skjemanr}</StyledDetail>
        </div>
      </Style>
      <Line />
    </>
  );
}
