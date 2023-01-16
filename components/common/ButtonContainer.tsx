import styled from 'styled-components';

export const ButtonContainer = styled.div`
    margin-right: auto;
    margin-top: 60px;
    width: fit-content;
    min-width: 207px;
    button {
        margin-bottom: 24px;
    }
    display: flex;

    flex-direction: column;

    @media only screen and (max-width: 600px) {
        width: 100%;
    }
`;
