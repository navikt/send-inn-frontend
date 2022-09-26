import styled from 'styled-components';

const Style = styled.div`
    min-height: 100vh;
    padding-top: 16px;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;
    > * {
        margin-left: auto;
        margin-right: auto;
    }
`;

const LayoutSC = ({ children }) => {
    return (
        <div className="content">
            <Style>
                {children}
                {/* footer could go here */}
            </Style>
        </div>
    );
};

export default LayoutSC;
