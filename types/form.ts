export type AllowedSubmissionType = 'PAPIR_OG_DIGITAL' | 'KUN_PAPIR' | 'KUN_DIGITAL' | 'INGEN';

export interface BasicForm {
  _id: string;
  modified: string;
  path: string;
  title: string;
}

export interface FyllytFormProperties {
  skjemanummer?: string;
  tema: string;
  innsending?: AllowedSubmissionType;
  ettersending?: AllowedSubmissionType;
  enhetstyper?: string[];
  enhetMaVelgesVedPapirInnsending?: boolean;
  uxSignalsId?: string;
}

export interface FyllutForm extends BasicForm {
  properties: FyllytFormProperties;
  attachments: Attachment[];
}

export interface Attachment {
  label: string;
  key: string;
  description: string;
  otherDocumentation: boolean;
  attachmentTitle: string;
  attachmentCode: string;
  attachmentForm?: string;
}
