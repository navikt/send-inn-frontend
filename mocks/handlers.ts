import { endreSoknad } from './handlers/endreSoknad';
import { endreVedlegg } from './handlers/endreVedlegg';
import { getFyllutForm } from './handlers/fyllutForm';
import { hentFiler } from './handlers/hentFiler';
import { hentSoknad } from './handlers/hentSoknad';
import { opprettFil } from './handlers/opprettFil';
import { opprettVedlegg } from './handlers/opprettVedlegg';
import { sendInn } from './handlers/sendInn';
import { slettFil } from './handlers/slettFil';
import { slettVedlegg } from './handlers/slettVedlegg';

export const handlers = [
  hentSoknad,
  sendInn,
  endreSoknad,
  opprettVedlegg,
  endreVedlegg,
  slettVedlegg,
  hentFiler,
  opprettFil,
  slettFil,
  getFyllutForm,
];
