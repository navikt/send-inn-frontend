import styled from 'styled-components';

const Style = styled.main`
  max-width: 60rem;
  min-height: 100vh;
  margin: 0 auto;

  @media screen and (max-width: 992px) {
    padding: 1rem;
  }

  @media screen and (min-width: 50rem) {
    display: grid;
    grid-column-gap: 3rem;
    grid-template-areas:
      'layout-header layout-header'
      'main-column side-column';
    grid-template-rows: auto 1fr;
    grid-template-columns: minmax(20rem, 2fr) minmax(15rem, 1fr);
    margin: 0 auto;
  }

  .layout-header {
    grid-area: layout-header;
  }

  .main-column {
    max-width: 38rem;
    grid-area: main-column;
  }

  .side-column {
    grid-area: side-column;
  }

  // Overskriver bakgrunnsfarge på secondary button i ds-css
  --ac-button-secondary-bg: var(--a-surface-default);
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <Style>{children}</Style>;
};
