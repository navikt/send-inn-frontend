import React, {
    useCallback,
    useEffect,
    useRef,
    cloneElement,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import { Upload } from '@navikt/ds-icons';
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
        box-shadow: inset 0 0 0 2px
                var(--navds-button-color-secondary-border),
            var(--navds-shadow-focus);
    }
`;

interface FilvelgerProps {
    onFileSelected: (fil: File) => void;
    CustomButton?: JSX.Element;
    allowMultiple?: boolean;
}

const DefaultButton = (
    <Button as="label" variant="secondary" icon={<Upload />}>
        Velg dine filer
    </Button>
);

export function Filvelger(props: FilvelgerProps) {
    const {
        onFileSelected,
        CustomButton,
        allowMultiple = true,
    } = props;

    const { register, handleSubmit, setValue, watch } =
        useForm<FormValues>();

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register('file');

    const inputId = uuidv4() as string;

    const onSubmit: SubmitHandler<FormValues> = useCallback(
        (data) => {
            if (!data.file?.length) {
                console.debug('Fil ikke valgt!');
            } else {
                const fileListArray = Array.from(data.file);
                fileListArray.forEach((fil, index) => {
                    console.debug(
                        `Legger til fil ${index + 1} av ${
                            fileListArray.length
                        }`,
                    );
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

    const CurrentButton = () =>
        cloneElement(CustomButton || DefaultButton, {
            htmlFor: inputId,
        });

    return (
        <FilvelgerForm>
            <StyledUpload
                id={inputId}
                {...rest}
                accept="image/png, image/jpeg, .pdf"
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
