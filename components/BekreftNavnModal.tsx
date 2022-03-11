import React from 'react';
import Modal from 'nav-frontend-modal';

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
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {
                setModalIsOpen(false);
            }}
            contentLabel={'something'}
            closeButton={true}
            shouldCloseOnOverlayClick={true}
            appElement={document.getElementById('root')!}
        >
            <div>greier</div>

            <div className="customModal">
                <div className="contentBlock"></div>
                <div className="centerButtons">
                    <div className="knappepanel">
                        <button
                            onClick={() => {
                                onClickOk();
                            }}
                        >
                            some ok button
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
