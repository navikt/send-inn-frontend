import styled from 'styled-components';

const Style = styled.main`
    max-width: 60rem;
    min-height: 100vh;
    padding-top: 16px;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;

    // Overskriver bakgrunnsfarge på secondary button i ds-css
    --ac-button-secondary-bg: var(--a-surface-default);
`;

export const Layout = ({ children }) => {
    return <Style>{children}</Style>;
};
