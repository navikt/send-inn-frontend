import { useContext, useEffect, useState } from 'react';
import { VedleggslisteContext } from './VedleggsListe';
import { BodyLong } from '@navikt/ds-react';

export const AutomatiskInnsending = () => {
    const { onSendInn } = useContext(VedleggslisteContext);
    const [skalSendeInn, setSkalSendeInn] = useState(true);

    useEffect(() => {
        if (skalSendeInn) {
            setSkalSendeInn(false);
            onSendInn();
        }
    }, [onSendInn, skalSendeInn]);

    return <BodyLong>{'Sender inn...'}</BodyLong>;
};
