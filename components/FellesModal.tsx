import React from 'react';
import { Modal, Button } from '@navikt/ds-react';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
    max-width: 700px;
`;

const ButtonRow = styled.div`
    padding-top: 37px;
    display: flex;
    justify-content: center;
    button {
        margin: 0 12px;
    }
`;

const StyledContent = styled(Modal.Content)`
    > *:first-child {
        margin-right: 36px;
    }

    ol,
    ul {
        padding-left: 1.75rem;
    }
    @media only screen and (max-width: 600px) {
        ol,
        ul {
            padding-left: 1.5rem;
        }
    }
`;

type FellesModalProps = {
    open: boolean;
    setOpen(isOpen: boolean): void;
    children?: React.ReactNode;
    onAccept(): void;
    acceptButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean;
};

export const FellesModal = (props: FellesModalProps) => {
    const {
        open,
        setOpen,
        onAccept,
        children,
        acceptButtonText,
        cancelButtonText,
        isLoading = false,
    } = props;

    StyledModal.setAppElement('#__next');

    return (
        <>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <StyledContent>
                    {children}
                    <ButtonRow>
                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={onAccept}
                            loading={isLoading}
                        >
                            {acceptButtonText || 'Ja'}
                        </Button>
                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={() => setOpen(false)}
                        >
                            {cancelButtonText || 'Nei'}
                        </Button>
                    </ButtonRow>
                </StyledContent>
            </StyledModal>
        </>
    );
};
