import { SoknadType } from '../types/types';

export const navigerTilFyllut = (soknad: SoknadType) => {
  location.assign(
    `${process.env.NEXT_PUBLIC_FYLLUT_URL}/${soknad.skjemaPath}/oppsummering?sub=digital&innsendingsId=${soknad.innsendingsId}`,
  );
};
