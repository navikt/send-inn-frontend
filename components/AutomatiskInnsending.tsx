import { useContext, useEffect, useState } from 'react';
import { VedleggslisteContext } from './VedleggsListe';
import { BodyLong } from '@navikt/ds-react';
import { useTranslation } from 'react-i18next';

export const AutomatiskInnsending = () => {
    const { onSendInn } = useContext(VedleggslisteContext);
    const { t } = useTranslation();
    const [skalSendeInn, setSkalSendeInn] = useState(true);

    useEffect(() => {
        if (skalSendeInn) {
            setSkalSendeInn(false);
            onSendInn();
        }
    }, [onSendInn, skalSendeInn]);

    return (
        <BodyLong>
            {t('soknad.visningsSteg.fraFyllutUtenVedlegg.laster')}
        </BodyLong>
    );
};
