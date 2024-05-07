import { endreSoknad } from './handlers/endreSoknad';
import { endreVedlegg } from './handlers/endreVedlegg';
import { getFyllutForm } from './handlers/fyllutForm';
import { hentFiler } from './handlers/hentFiler';
import { hentSoknad } from './handlers/hentSoknad';
import { opprettEttersending } from './handlers/opprettEttersending';
import { opprettFil } from './handlers/opprettFil';
import { opprettSoknad } from './handlers/opprettSoknad';
import { opprettVedlegg } from './handlers/opprettVedlegg';
import { sendInn } from './handlers/sendInn';
import { slettFil } from './handlers/slettFil';
import { slettVedlegg } from './handlers/slettVedlegg';

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
  getFyllutForm,
];
