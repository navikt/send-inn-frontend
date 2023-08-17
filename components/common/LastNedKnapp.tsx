import { DownloadIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';
import { ScreenReaderOnly } from '../textStyle';

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
    const { t } = useTranslation();
    return (
        <Button
            as="a"
            variant={variant}
            target="_blank"
            href={url}
            rel="noopener noreferrer"
            icon={<DownloadIcon aria-hidden />}
            data-cy="lastNedKnapp"
        >
            {children}
            <ScreenReaderOnly>
                {t('link.nyFane', { tekst: '' })}
            </ScreenReaderOnly>
        </Button>
    );
};
