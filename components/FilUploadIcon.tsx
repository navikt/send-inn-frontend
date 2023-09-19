import styled from 'styled-components';
import { FIL_STATUS } from '../types/enums';
import { useTranslation } from 'react-i18next';
import {
    FileLoadingIcon,
    FileCheckmarkIcon,
    FileXMarkIcon,
} from '@navikt/aksel-icons';

// https://stackoverflow.com/a/63620855
interface FileUploadIconProps {
    filstatus?: (typeof FIL_STATUS)[keyof typeof FIL_STATUS];
    filnavn: string;
}

const StyledDiv = styled.div`
    border-radius: 4px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.875rem;
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

function ErrorFileIcon({ filnavn }: { filnavn: string }) {
    const { t } = useTranslation();
    return (
        <ErrorStyled>
            <div>
                <FileXMarkIcon
                    title={t('soknad.vedlegg.fil.alt.feil', {
                        filnavn,
                    })}
                />
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

function AlreadyUploadedFileIcon({ filnavn }: { filnavn: string }) {
    const { t } = useTranslation();
    return (
        <AlreadyUploadedStyled>
            <div>
                <FileCheckmarkIcon
                    title={t(
                        'soknad.vedlegg.fil.alt.tidligereLastetOpp',
                        {
                            filnavn,
                        },
                    )}
                />
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

function UploadingFileIcon({ filnavn }: { filnavn: string }) {
    const { t } = useTranslation();
    return (
        <UploadingStyled>
            <div>
                <FileLoadingIcon
                    title={t('soknad.vedlegg.fil.alt.lasterOpp', {
                        filnavn,
                    })}
                />
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

function SuccessFileIcon({ filnavn }: { filnavn: string }) {
    const { t } = useTranslation();
    return (
        <SuccessStyled>
            <FileCheckmarkIcon
                title={t('soknad.vedlegg.fil.alt.opplastet', {
                    filnavn,
                })}
                data-cy="fileUploadSuccessIkon"
            />
        </SuccessStyled>
    );
}

export function FilUploadIcon(props: FileUploadIconProps) {
    return (
        <>
            {props.filstatus === FIL_STATUS.FEIL && (
                <ErrorFileIcon filnavn={props.filnavn} />
            )}
            {props.filstatus === FIL_STATUS.OPPLASTET && (
                <SuccessFileIcon filnavn={props.filnavn} />
            )}
            {props.filstatus === FIL_STATUS.LASTER_OPP && (
                <UploadingFileIcon filnavn={props.filnavn} />
            )}
            {props.filstatus === FIL_STATUS.TIDLIGERE_LASTET_OPP && (
                <AlreadyUploadedFileIcon filnavn={props.filnavn} />
            )}
        </>
    );
}
