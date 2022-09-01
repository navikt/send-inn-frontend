import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import { Upload } from '@navikt/ds-icons';
type FormValues = {
    file: FileList | null;
};

interface FilvelgerProps {
    onFileSelected: (fil: File) => void;
    CustomButton?: ({
        children,
    }: {
        children: React.ReactNode;
    }) => JSX.Element;
    allowMultiple?: boolean;
}

const DefaultButton = ({ children }) => {
    return (
        <Button as="label" variant="secondary">
            <Upload />
            Velg dine filer
            {children}
        </Button>
    );
};

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

    const CurrentButton = CustomButton || DefaultButton;

    return (
        <form>
            <CurrentButton>
                <input
                    {...rest}
                    accept="image/png, image/jpeg, .pdf"
                    multiple={allowMultiple}
                    type="file"
                    // TODO?: Støtte for drag&drop. Kan ikke bruke display: none. Eksempel på løsning: https://stackoverflow.com/a/44277812/15886307
                    style={{ display: 'none' }}
                    ref={(e) => {
                        ref(e);
                        fileRef.current = e; // you can still assign to ref
                    }}
                />
            </CurrentButton>
        </form>
    );
}
