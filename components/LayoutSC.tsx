import styled from 'styled-components';

const Style = styled.div`
    min-height: 100vh;
    padding: 4vmin 4vmin 30vmin;
    contentmaxwidth: 30rem;
    layoutmaxwidth: 50rem;
    max-width: 50rem;
    margin: 0 auto;
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
