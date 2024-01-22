import styled from 'styled-components';

interface ButtonContainerProps {
  readonly $reverse?: boolean;
}

export const ButtonContainer = styled.div<ButtonContainerProps>`
  button {
    flex-grow: 1;
    max-width: 18.75rem;
    min-width: 10rem;
    @media only screen and (max-width: 475px) {
      width: 100%;
      max-width: unset;
    }
  }
  gap: var(--a-spacing-5);
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--a-spacing-5);
  flex-direction: ${(props) => (props.$reverse ? 'row-reverse' : 'row')};
  justify-content: ${(props) => (props.$reverse ? 'flex-end' : 'flex-start')};

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
