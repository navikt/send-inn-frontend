import Script from 'next/script';

interface Props {
  id?: string;
  demo: boolean;
}

const UXSignals = ({ id, demo = false }: Props) => {
  return (
    <section>
      <Script type="module" strategy="lazyOnload" src="https://widget.uxsignals.com/embed.js" />
      <div data-uxsignals-embed={id} data-uxsignals-mode={demo === true ? 'demo' : ''} style={{ maxWidth: '620px' }} />
    </section>
  );
};

export default UXSignals;
