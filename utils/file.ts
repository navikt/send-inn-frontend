// keep order so that most common file types are at the top
const FILE_FORMATS = [
  { mimeType: 'application/pdf', extension: 'pdf' },
  { mimeType: 'image/jpeg', extension: 'jpeg/jpg' },
  { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx' },
  { mimeType: 'application/msword', extension: 'doc' },
  { mimeType: 'application/vnd.oasis.opendocument.text', extension: 'odt' },
  { mimeType: 'application/rtf', extension: 'rtf' },
  { mimeType: 'text/rtf', extension: undefined }, // same extension as 'application/rtf'
  { mimeType: 'text/plain', extension: 'txt' },
  { mimeType: 'image/png', extension: 'png' },
  { mimeType: 'image/tiff', extension: 'tiff/tif' },
  { mimeType: 'image/bmp', extension: 'bmp' },
  { mimeType: 'image/gif', extension: 'gif' },
];

const validMimeTypes: string[] = FILE_FORMATS.map((format) => format.mimeType);
const validExtensions = FILE_FORMATS.map((format) => format.extension).filter((ext) => ext !== undefined);

export const fileUtils = {
  isValidMimeType: (mimeType: string) => validMimeTypes.includes(mimeType),
  validExtensions,
};
