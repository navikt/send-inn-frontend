const FILFORMATER = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpeg/jpg',
  'image/png': 'png',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff/tif',
  'image/gif': 'gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/rtf': 'rtf',
  'text/rtf': undefined, // covered by 'application/rtf'
  'text/plain': 'txt',
};

const validMimeTypes = Object.keys(FILFORMATER);

export const fileUtils = {
  isValidMimeType: (mimeType: string) => validMimeTypes.includes(mimeType),
  validExtensions: Object.values(FILFORMATER).filter((ext) => ext !== undefined),
};
