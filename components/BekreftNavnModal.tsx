import React from 'react';
import { Modal } from '@navikt/ds-react';

type BekreftNavnModalProps = {
    isOpen: boolean;
    setModalIsOpen(isOpen: boolean): void;
};

export const BekreftNavnModal = (props: BekreftNavnModalProps) => {
    const { isOpen, setModalIsOpen } = props;

    const onClickOk = () => {
        setModalIsOpen(false);
    };

    return (
        <Modal>
            <Modal.Content>Innhold her!</Modal.Content>
        </Modal>
    );
};
