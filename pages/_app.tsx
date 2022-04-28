import type { AppProps } from 'next/app';
import Layout from '../components/LayoutSC';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <I18nextProvider i18n={i18n}>
                <Component {...pageProps} />
            </I18nextProvider>
        </Layout>
    );
}
export default MyApp;
