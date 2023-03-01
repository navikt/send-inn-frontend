import { hentSoknad } from './handlers/hentSoknad.js';
import { opprettEttersending } from './handlers/opprettEttersending.js';
import { opprettSoknad } from './handlers/opprettSoknad.js';
import { sendInn } from './handlers/sendInn.js';
import { endreSoknad } from './handlers/endreSoknad.js';
import { opprettVedlegg } from './handlers/opprettVedlegg.js';
import { endreVedlegg } from './handlers/endreVedlegg.js';
import { slettVedlegg } from './handlers/slettVedlegg.js';
import { hentFiler } from './handlers/hentFiler.js';
import { opprettFil } from './handlers/opprettFil.js';
import { slettFil } from './handlers/slettFil.js';

export const handlers = [
    opprettSoknad,
    opprettEttersending,
    hentSoknad,
    sendInn,
    endreSoknad,
    opprettVedlegg,
    endreVedlegg,
    slettVedlegg,
    hentFiler,
    opprettFil,
    slettFil,
];
