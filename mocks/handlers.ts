import { endreSoknad } from './handlers/endreSoknad.js';
import { endreVedlegg } from './handlers/endreVedlegg.js';
import { hentFiler } from './handlers/hentFiler.js';
import { hentSoknad } from './handlers/hentSoknad.js';
import { opprettEttersending } from './handlers/opprettEttersending.js';
import { opprettFil } from './handlers/opprettFil.js';
import { opprettSoknad } from './handlers/opprettSoknad.js';
import { opprettVedlegg } from './handlers/opprettVedlegg.js';
import { sendInn } from './handlers/sendInn.js';
import { slettFil } from './handlers/slettFil.js';
import { slettVedlegg } from './handlers/slettVedlegg.js';

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
