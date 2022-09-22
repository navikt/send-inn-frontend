import styled from 'styled-components';
import { FIL_STATUS } from '../types/enums';
import { File, FileError, FileSuccess } from '@navikt/ds-icons';

// https://stackoverflow.com/a/63620855
interface FileUploadIconProps {
    filstatus: typeof FIL_STATUS[keyof typeof FIL_STATUS];
}

const StyledDiv = styled.div`
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    > * {
        border-color: var(--navds-semantic-color-interaction-danger);
        line-height: 0px;
    }
`;

const ErrorStyled = styled(StyledDiv)`
    background-color: var(
        --navds-semantic-color-feedback-danger-background
    );

    > * {
        color: var(--navds-semantic-color-interaction-danger);
    }
`;

function ErrorFileIcon() {
    return (
        <ErrorStyled>
            <div>
                <FileError />
            </div>
        </ErrorStyled>
    );
}

const AlreadyUploadedStyled = styled(StyledDiv)`
    background-color: var(--navds-semantic-color-canvas-background);

    > * {
        color: var(--navds-semantic-color-text-muted);
    }
`;

function AlreadyUploadedFileIcon() {
    return (
        <AlreadyUploadedStyled>
            <div>
                <FileSuccess />
            </div>
        </AlreadyUploadedStyled>
    );
}

const UploadingStyled = styled(StyledDiv)`
    background-color: var(
        --navds-semantic-color-feedback-info-background
    );

    > * {
        color: var(--navds-semantic-color-feedback-info-icon);
    }
`;

function UploadingFileIcon() {
    return (
        <UploadingStyled>
            <div>
                <File />
            </div>
        </UploadingStyled>
    );
}

const SuccessStyled = styled(StyledDiv)`
    background-color: var(
        --navds-semantic-color-feedback-success-background
    );
    > * {
        color: var(--navds-semantic-color-feedback-success-icon);
    }
`;

function SuccessFileIcon() {
    return (
        <SuccessStyled>
            <div>
                <FileSuccess />
            </div>
        </SuccessStyled>
    );
}

export function FilUploadIcon(props: FileUploadIconProps) {
    return (
        <>
            {props.filstatus === FIL_STATUS.FEIL && <ErrorFileIcon />}
            {props.filstatus === FIL_STATUS.OPPLASTET && (
                <SuccessFileIcon />
            )}
            {props.filstatus === FIL_STATUS.LASTER_OPP && (
                <UploadingFileIcon />
            )}
            {props.filstatus === FIL_STATUS.TIDLIGERE_LASTET_OPP && (
                <AlreadyUploadedFileIcon />
            )}
        </>
    );
}
