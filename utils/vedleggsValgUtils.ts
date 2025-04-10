import { AttachmentValue } from '../types/fyllutForm';
import { OpplastingsStatus, SoknadType, VedleggsValgAlternativ, VedleggsvalgType } from '../types/types';

const vedleggsValgAlternativer: VedleggsValgAlternativ[] = [
  {
    key: 'LasterOpp',
    fyllutKey: 'leggerVedNaa',
    translationKey: 'soknad.vedlegg.radio.lasterOppNaa',
    dataCy: 'lasterOppNaaRadio',
    default: true,
  },
  {
    key: 'SendSenere',
    fyllutKey: 'ettersender',
    translationKey: 'soknad.vedlegg.radio.sendSenere',
    dataCy: 'sendSenereRadio',
    default: true,
  },
  {
    key: 'LevertDokumentasjonTidligere',
    fyllutKey: 'levertTidligere',
    translationKey: 'soknad.vedlegg.radio.levertDokumentasjonTidligere',
    dataCy: 'levertTidligereRadio',
  },
  {
    key: 'HarIkkeDokumentasjonen',
    fyllutKey: 'harIkke',
    translationKey: 'soknad.vedlegg.radio.harIkkeDokumentasjonen',
    dataCy: 'harIkkeDokumentasjonenRadio',
  },
  {
    key: 'SendesAvAndre',
    fyllutKey: 'andre',
    translationKey: 'soknad.vedlegg.radio.sendesAvAndre',
    dataCy: 'sendesAvAndreRadio',
    default: true,
  },
  {
    key: 'NavKanHenteDokumentasjon',
    fyllutKey: 'nav',
    translationKey: 'soknad.vedlegg.radio.navKanHenteDokumentasjon',
  },
];

export const hentVedleggsValgAlternativer = (
  attachmentValues?: AttachmentValue[],
  soknad?: SoknadType,
): VedleggsValgAlternativ[] => {
  let result: VedleggsValgAlternativ[];

  if (!attachmentValues || !attachmentValues.length) {
    result = vedleggsValgAlternativer.filter((valg) => !!valg.default);
  } else {
    result = vedleggsValgAlternativer
      .filter((valg) => !!attachmentValues.find((value) => value.key === valg.fyllutKey))
      .map((valg) => {
        const attachmentValue = attachmentValues.find((value) => value.key === valg.fyllutKey);
        return {
          ...attachmentValue,
          ...valg,
        };
      });
  }

  // Conditionally add "HarIkkeDokumentasjonen" if not in environment and 'ettersending'
  if (soknad && soknad.erNavOpprettet && soknad.visningsType === 'ettersending') {
    const harIkkeDokumentasjonen = vedleggsValgAlternativer.find((valg) => valg.key === 'HarIkkeDokumentasjonen');
    if (harIkkeDokumentasjonen && !result.some((valg) => valg.key === 'HarIkkeDokumentasjonen')) {
      result = [...result, harIkkeDokumentasjonen];
    }
  }

  return result;
};

export const mapOpplastingStatusToVedleggsvalg = (status: OpplastingsStatus): VedleggsvalgType => {
  return status === 'IkkeValgt' || status === 'LastetOpp' ? 'LasterOpp' : status;
};

export const mapVedleggsvalgToOpplastingStatus = (
  valg: VedleggsvalgType,
  harOpplastetFil: boolean,
): OpplastingsStatus => {
  if (valg === 'LasterOpp') {
    return harOpplastetFil ? 'LastetOpp' : 'IkkeValgt';
  }
  return valg;
};
