import styled from 'styled-components';

const Content = styled.div`
    font-size: 1.5em;
    text-align: center;
    font-family: arial;
    line-height: 1.5;
    max-width: 900px;
`;

// TODO fix: Binding element 'children' implicitly has an 'any' type.ts(7031)
const LayoutSC = ({ children }) => {
    return (
        <div className="content">
            <h1> header</h1>
            <Content>
                {children}
                {/* footer could go here */}
            </Content>
            <h1> footer</h1>
        </div>
    );
};

export default LayoutSC;
