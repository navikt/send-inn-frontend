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
  enhetstyper?: string[];
  enhetMaVelgesVedPapirInnsending?: boolean;
  uxSignalsId?: string;
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
