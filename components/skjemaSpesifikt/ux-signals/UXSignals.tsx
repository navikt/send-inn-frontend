import { useEffect } from 'react';

interface Props {
  id?: string;
  demo: boolean;
}

const UXSignals = ({ id, demo = false }: Props) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section>
      <div data-uxsignals-embed={id} data-uxsignals-mode={demo ? 'demo' : ''} style={{ maxWidth: '620px' }} />
    </section>
  );
};

export default UXSignals;
