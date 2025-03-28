import { SoknadType } from '../types/types';

export const isLospost = (soknad: SoknadType): boolean => soknad.visningsType === 'lospost';

export const getPathForFyllutUrl = (soknad: SoknadType) => {
  return `${soknad.skjemaPath}/oppsummering?sub=digital&innsendingsId=${soknad.innsendingsId}`;
};
