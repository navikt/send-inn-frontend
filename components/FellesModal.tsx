import React from 'react';
import { Modal, Button } from '@navikt/ds-react';

type FellesModalProps = {
    open: boolean;
    setOpen(isOpen: boolean): void;
    children?: React.ReactNode;
    onAccept(): void;
    acceptButtonText?: string;
    cancelButtonText?: string;
};

export const FellesModal = (props: FellesModalProps) => {
    const {
        open,
        setOpen,
        onAccept,
        children,
        acceptButtonText,
        cancelButtonText,
    } = props;

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Content>
                    {children}
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={onAccept}
                    >
                        {acceptButtonText || 'Ja'}
                    </Button>
                    <Button variant="secondary" size="medium">
                        {cancelButtonText || 'Nei'}
                    </Button>
                </Modal.Content>
            </Modal>
        </>
    );
};
