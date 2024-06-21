import { TranslationKey } from '../i18next';
import { AttachmentValueKeys } from './fyllutForm';

// API
export type OpplastingsStatus =
  | 'IkkeValgt'
  | 'LastetOpp'
  | 'Innsendt'
  | 'SendSenere'
  | 'SendesAvAndre'
  | 'SendesIkke'
  | 'LastetOppIkkeRelevantLenger'
  | 'LevertDokumentasjonTidligere'
  | 'HarIkkeDokumentasjonen'
  | 'NavKanHenteDokumentasjon';

export type VedleggType = {
  id: number;
  vedleggsnr: string;
  tittel: string;
  uuid: string;
  mimetype: string;
  document: string;
  erHoveddokument: boolean;
  erVariant: boolean;
  erPdfa: boolean;
  skjemaurl: string;
  opplastingsStatus: OpplastingsStatus;
  opprettetdato: string;
  label: string;
  beskrivelse: string;
  erPakrevd: boolean;
  innsendtdato: string | null;
  opplastingsValgKommentar: string | null;
  opplastingsValgKommentarLedetekst: string | null;
};

export type PatchVedleggDto = {
  tittel?: string;
  opplastingsStatus?: OpplastingsStatus;
  opplastingsValgKommentarLedetekst?: string | null;
  opplastingsValgKommentar?: string | null;
};

export type OpplastetFil = {
  id: number;
  filnavn: string;
  storrelse: number;
};

export type VisningsType = 'fyllUt' | 'dokumentinnsending' | 'ettersending';

export type SoknadType = {
  id: number;
  innsendingsId: string;
  ettersendingsId: null;
  brukerId: string;
  skjemaPath: string;
  skjemanr: string;
  tittel: string;
  tema: string;
  spraak: string;
  status: string;
  opprettetDato: string;
  fristForEttersendelse: number; // dager til en evt. ettersendingsfrist etter innsending
  innsendingsFristDato: string;
  endretDato: string;
  innsendtDato: null;
  vedleggsListe: VedleggType[];
  visningsType: VisningsType;
  visningsSteg: number;
  kanLasteOppAnnet: boolean;
};

export type InnsendtVedleggDto = {
  vedleggsnr: string;
  tittel: string;
  url: string;
  opplastingsValgKommentarLedetekst: string;
  opplastingsValgKommentar: string;
};

export type KvitteringsDto = {
  innsendingsId: string;
  label: string;
  mottattdato: string;
  hoveddokumentRef: string;
  innsendteVedlegg: InnsendtVedleggDto[];
  skalEttersendes: InnsendtVedleggDto[];
  levertTidligere: InnsendtVedleggDto[];
  sendesIkkeInn: InnsendtVedleggDto[];
  skalSendesAvAndre: InnsendtVedleggDto[];
  navKanInnhente: InnsendtVedleggDto[];
  ettersendingsfrist: string;
};

type errorCodesWithHandling =
  | 'illegalAction.applicationSentInOrDeleted'
  | 'illegalAction.fileCannotBeRead'
  | 'illegalAction.sendInErrorNoApplication'
  | 'illegalAction.sendInErrorNoChange'
  | 'illegalAction.notSupportedFileFormat'
  | 'illegalAction.fileSizeSumTooLarge'
  | 'illegalAction.vedleggFileSizeSumTooLarge'
  | 'illegalAction.virusScanFailed'
  | 'illegalAction.fileWithTooManyPages';

export type ErrorResponsDto = {
  arsak: string;
  errorCode: errorCodesWithHandling;
  message: string;
  timeStamp: string;
};

// APP

export type VedleggsvalgType = 'LasterOpp' | Exclude<OpplastingsStatus, 'IkkeValgt' | 'LastetOpp'>;
export type VedleggsValgAlternativ = {
  key: VedleggsvalgType;
  fyllutKey: AttachmentValueKeys;
  translationKey: TranslationKey;
  dataCy?: string;
  additionalDocumentationLabel?: string;
  additionalDocumentationDescription?: string;
  deadlineWarning?: string;
  default?: boolean;
};
