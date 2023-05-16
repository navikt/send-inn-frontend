import { Download } from '@navikt/ds-icons';
import { Button, ButtonProps } from '@navikt/ds-react';

interface LastNedKnappProps {
    children: string;
    url: string;
    variant?: ButtonProps['variant'];
}

export const LastNedKnapp = ({
    children,
    url,
    variant = 'secondary',
}: LastNedKnappProps) => {
    return (
        <Button
            as="a"
            variant={variant}
            target="_blank"
            href={url}
            rel="noopener noreferrer"
            icon={<Download />}
            data-cy="lastNedKnapp"
        >
            {children}
        </Button>
    );
};
