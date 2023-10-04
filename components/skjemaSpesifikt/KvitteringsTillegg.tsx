import Script from 'next/script';
import { ReactNode } from 'react';

const Skjemaer: Record<string, ReactNode> = {
  'NAV 08-09.06': (
    <>
      <Script type="module" strategy="lazyOnload" src="https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js" />
      <div data-uxsignals-embed="study-dont9j6txe" style={{ maxWidth: '620px' }} />
    </>
  ),
};

interface KvitteringsTilleggProps {
  skjemanr: string;
}

export const KvitteringsTillegg = ({ skjemanr }: KvitteringsTilleggProps) => {
  const Tillegg = Skjemaer[skjemanr];
  if (Tillegg) {
    return Tillegg;
  } else {
    return null;
  }
};
