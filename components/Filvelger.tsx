import { UploadIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { cloneElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

type FormValues = {
  file: FileList | null;
};

const StyledUpload = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const FilvelgerForm = styled.form`
  input[type='file']:focus + label {
    box-shadow:
      inset 0 0 0 2px var(--a-border-action),
      var(--a-shadow-focus);
  }
`;

interface FilvelgerProps {
  autoFocus?: boolean;
  onFileSelected: (fil: File) => void;
  CustomButton?: JSX.Element;
  allowMultiple?: boolean;
  buttonText?: string | null;
}

export function Filvelger(props: FilvelgerProps) {
  const { autoFocus, onFileSelected, CustomButton, allowMultiple = true, buttonText } = props;
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>();

  const fileRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register('file');

  const inputId = useMemo<string>(uuidv4, []);

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    (data) => {
      if (!data.file?.length) {
        console.debug('Fil ikke valgt!');
      } else {
        const fileListArray = Array.from(data.file);
        fileListArray.forEach((fil, index) => {
          console.debug(`Legger til fil ${index + 1} av ${fileListArray.length}`);
          onFileSelected(fil);
        });

        setValue('file', null);

        if (fileRef.current) {
          fileRef.current.value = '';
        }
      }
    },
    [setValue, onFileSelected],
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'file') {
        console.debug('Fil endret', value);
        if (value?.file) {
          console.debug('Starter filopplasting...');
          handleSubmit(onSubmit)();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  const CurrentButton = useCallback(() => {
    const DefaultButton = (
      <Button
        as="label"
        variant="secondary"
        icon={<UploadIcon aria-hidden />}
        data-cy="filvelgerKnapp"
        role={undefined} // Label kan ikke ha role='button', som settes automatisk
      >
        {buttonText || t('filvelger.defaultText')}
      </Button>
    );
    return cloneElement(CustomButton || DefaultButton, {
      htmlFor: inputId,
    });
  }, [CustomButton, inputId, buttonText, t]);

  return (
    <FilvelgerForm>
      <StyledUpload
        autoFocus={autoFocus}
        id={inputId}
        {...rest}
        accept=".pdf, image/jpeg,  image/png, image/tiff, image/bmp, image/gif, .docx, .doc, .odt, .rtf, .txt, text/plain"
        multiple={allowMultiple}
        type="file"
        // TODO?: Støtte for drag&drop. Kan ikke bruke display: none. Eksempel på løsning: https://stackoverflow.com/a/44277812/15886307
        ref={(e) => {
          ref(e);
          fileRef.current = e; // you can still assign to ref
        }}
      />
      <CurrentButton />
    </FilvelgerForm>
  );
}
