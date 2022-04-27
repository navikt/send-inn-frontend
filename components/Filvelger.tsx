import React, { useCallback, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
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

    const { register, handleSubmit, setValue, control } =
        useForm<FormValues>();

    const fileRef = useRef<HTMLInputElement | null>(null);
    const { ref, ...rest } = register('file');
    const watchFile = useWatch({
        control,
        name: 'file',
    });

    const onSubmit: SubmitHandler<FormValues> = useCallback(
        (data) => {
            if (!data.file?.length) {
                console.log('Fil ikke valgt!');
            } else {
                Array.from(data.file).forEach((fil) => {
                    console.log('Legger til fil');
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
        console.log('Fil endret', watchFile);
        if (watchFile) {
            console.log('Starter filopplasting...');
            handleSubmit(onSubmit)();
        }
    }, [watchFile, handleSubmit, onSubmit]);
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
