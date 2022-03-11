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
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Content>
                    <Heading spacing level="1" size="large">
                        Header
                    </Heading>
                    <Heading spacing level="2" size="medium">
                        Subheading
                    </Heading>
                    <BodyLong spacing>
                        Cupidatat irure ipsum veniam ad in esse.
                    </BodyLong>
                    <BodyLong>
                        Cillum tempor pariatur amet ut laborum Lorem
                        enim enim.
                    </BodyLong>
                </Modal.Content>
            </Modal>
        </>
    );
};
