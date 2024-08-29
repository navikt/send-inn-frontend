import { SoknadType } from '../types/types';

export const isLospost = (soknad: SoknadType): boolean => soknad.visningsType === 'lospost';
