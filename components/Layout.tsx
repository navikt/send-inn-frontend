import styled from 'styled-components';

const Style = styled.div`
    max-width: 50rem;
    min-height: 100vh;
    padding-top: 16px;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;

    // Overskriver bakgrunnsfarge på secondary button i ds-css
    --ac-button-secondary-bg: var(--a-surface-default);
    > * {
        margin-left: auto;
        margin-right: auto;
    }
`;

export const Layout = ({ children }) => {
    return (
        <div className="content">
            <Style>
                {children}
                {/* footer could go here */}
            </Style>
        </div>
    );
};
