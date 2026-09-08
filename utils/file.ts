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

const isVersionAtLeast265 = (match: RegExpMatchArray | null) => {
  if (!match) {
    return false;
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  return major > 26 || (major === 26 && minor >= 5);
};

const isAffectedWebKitVersion = (userAgent: string) => {
  if (!userAgent.includes('AppleWebKit')) {
    return false;
  }

  // TODO: Narrow this range when https://bugs.webkit.org/show_bug.cgi?id=319985 has a confirmed fixed release.
  const safariVersion = userAgent.match(/Version\/(\d+)\.(\d+).*Safari\//);
  const iosVersion = userAgent.match(/(?:CPU(?: iPhone)? OS|iPhone OS) (\d+)_(\d+)/);
  return isVersionAtLeast265(safariVersion) || isVersionAtLeast265(iosVersion);
};

export const fileUtils = {
  isValidMimeType: (mimeType: string) => validMimeTypes.includes(mimeType),
  exceedsMaxSize: (sizeInBytes: number, maxSizeInMb: number) => sizeInBytes > maxSizeInMb * 1024 * 1024,
  prepareForUpload: async (file: File, userAgent: string): Promise<File> => {
    if (!isAffectedWebKitVersion(userAgent)) {
      return file;
    }

    return new File([await file.arrayBuffer()], file.name, {
      lastModified: file.lastModified,
      type: file.type,
    });
  },
  validExtensions,
};
