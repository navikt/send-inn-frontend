import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@navikt/ds-react';
import { Upload } from '@navikt/ds-icons';
import { ACTIONS, ActionType } from './Vedlegg';

type FormValues = {
    file: FileList | null;
};

interface FilvelgerProps {
    filListeDispatch: React.Dispatch<ActionType>;
}

export function Filvelger(props: FilvelgerProps) {
    const { filListeDispatch } = props;

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
                    filListeDispatch({
                        type: ACTIONS.NY_FIL,
                        filData: {
                            lokalFil: fil,
                        },
                    });
                });

                setValue('file', null);

                if (fileRef.current) {
                    fileRef.current.value = '';
                }
            }
        },
        [setValue, filListeDispatch],
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
    return (
        <form>
            <Button as="label" variant="secondary">
                <Upload />
                Velg dine filer
                <input
                    {...rest}
                    multiple
                    type="file"
                    // TODO?: Støtte for drag&drop. Kan ikke bruke display: none. Eksempel på løsning: https://stackoverflow.com/a/44277812/15886307
                    style={{ display: 'none' }}
                    ref={(e) => {
                        ref(e);
                        fileRef.current = e; // you can still assign to ref
                    }}
                />
            </Button>
        </form>
    );
}
