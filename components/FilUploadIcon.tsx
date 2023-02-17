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
        line-height: 0px;
    }
`;

const ErrorStyled = styled(StyledDiv)`
    background-color: var(--a-surface-danger-subtle);

    > * {
        color: var(--a-surface-danger);
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
    background-color: var(--a-bg-subtle);

    > * {
        color: var(--a-text-subtle);
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
    background-color: var(--a-surface-info-subtle);

    > * {
        color: var(--a-icon-info);
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
    background-color: var(--a-surface-success-subtle);
    > * {
        color: var(--a-icon-success);
    }
`;

function SuccessFileIcon() {
    return (
        <SuccessStyled>
            <div data-cy="fileUploadSuccessIkon">
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
