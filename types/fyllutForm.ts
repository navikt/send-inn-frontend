export type DeprecatedSubmissionType = 'PAPIR_OG_DIGITAL' | 'KUN_PAPIR' | 'KUN_DIGITAL' | 'INGEN';
export type AllowedSubmissionType = 'PAPER' | 'DIGITAL';

export interface BasicForm {
  _id: string;
  modified: string;
  path: string;
  title: string;
}

export interface FyllytFormProperties {
  skjemanummer?: string;
  tema: string;
  submissionTypes: AllowedSubmissionType[];
  subsequentSubmissionTypes: AllowedSubmissionType[];
  ettersending?: DeprecatedSubmissionType;
  enhetstyper?: string[];
  enhetMaVelgesVedPapirInnsending?: boolean;
  uxSignalsId?: string;
  uxSignalsInnsending?: DeprecatedSubmissionType;
  uxSignalsSubmissionTypes?: AllowedSubmissionType[];
}

export interface FyllutForm extends BasicForm {
  properties: FyllytFormProperties;
  attachments: Attachment[];
}

export type AttachmentValueKeys = 'leggerVedNaa' | 'ettersender' | 'levertTidligere' | 'harIkke' | 'andre' | 'nav';

export interface AttachmentValue {
  key: AttachmentValueKeys;
  additionalDocumentationLabel?: string;
  additionalDocumentationDescription?: string;
  deadlineWarning?: string;
}
export interface Attachment {
  label: string;
  key: string;
  description: string;
  otherDocumentation: boolean;
  attachmentTitle: string;
  attachmentCode: string;
  attachmentForm?: string;
  attachmentValues?: AttachmentValue[];
}
