import { Button, ButtonProps, Modal } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  max-width: 700px;
`;

const StyledModalBody = styled(Modal.Body)`
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
  heading: string;
  open: boolean;
  setOpen(isOpen: boolean): void;
  children?: React.ReactNode;
  onAccept?: () => void;
  acceptButtonText?: string;
  cancelButtonText?: string;
  acceptButtonVariant?: ButtonProps['variant'];
  cancelButtonVariant?: ButtonProps['variant'];
  isLoading?: boolean;
  closeButton?: boolean;
};

export const FellesModal = (props: FellesModalProps) => {
  const {
    heading,
    open,
    setOpen,
    onAccept,
    children,
    acceptButtonText = null,
    cancelButtonText = null,
    acceptButtonVariant = 'primary',
    cancelButtonVariant = 'tertiary',
    isLoading = false,
    closeButton = true,
  } = props;

  return (
    <>
      <StyledModal header={{ heading, closeButton, size: 'medium' }} open={open} onClose={() => setOpen(false)}>
        <StyledModalBody>{children}</StyledModalBody>
        {(acceptButtonText || cancelButtonText) && (
          <Modal.Footer>
            {acceptButtonText && (
              <Button
                variant={acceptButtonVariant}
                size="medium"
                onClick={onAccept}
                loading={isLoading}
                data-cy="jaFellesModalKnapp"
              >
                {acceptButtonText}
              </Button>
            )}
            {cancelButtonText && (
              <Button
                variant={cancelButtonVariant}
                size="medium"
                onClick={() => setOpen(false)}
                data-cy="neiFellesModalKnapp"
              >
                {cancelButtonText}
              </Button>
            )}
          </Modal.Footer>
        )}
      </StyledModal>
    </>
  );
};
