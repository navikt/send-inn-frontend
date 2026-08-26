import { FileCheckmarkIcon, FileLoadingIcon, FileXMarkIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FIL_STATUS } from '../types/enums';

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
  background-color: var(--ax-bg-danger-soft);

  > * {
    color: var(--ax-text-danger-decoration);
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
  background-color: var(--ax-bg-neutral-soft);

  > * {
    color: var(--ax-text-neutral-subtle);
  }
`;

function AlreadyUploadedFileIcon({ filnavn }: { filnavn: string }) {
  const { t } = useTranslation();
  return (
    <AlreadyUploadedStyled>
      <div>
        <FileCheckmarkIcon
          title={t('soknad.vedlegg.fil.alt.tidligereLastetOpp', {
            filnavn,
          })}
        />
      </div>
    </AlreadyUploadedStyled>
  );
}

const UploadingStyled = styled(StyledDiv)`
  background-color: var(--ax-bg-info-soft);

  > * {
    color: var(--ax-text-info-decoration);
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
  background-color: var(--ax-bg-success-soft);
  > * {
    color: var(--ax-text-success-decoration);
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
      {props.filstatus === FIL_STATUS.FEIL && <ErrorFileIcon filnavn={props.filnavn} />}
      {props.filstatus === FIL_STATUS.OPPLASTET && <SuccessFileIcon filnavn={props.filnavn} />}
      {props.filstatus === FIL_STATUS.LASTER_OPP && <UploadingFileIcon filnavn={props.filnavn} />}
      {props.filstatus === FIL_STATUS.TIDLIGERE_LASTET_OPP && <AlreadyUploadedFileIcon filnavn={props.filnavn} />}
    </>
  );
}
