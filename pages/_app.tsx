import type { AppProps } from 'next/app';
import Layout from '../components/LayoutSC';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import { SWRConfig } from 'swr';
import fetchJson from '../lib/fetchJson';
import { AuthenticationProvider } from '../components/AuthenticationProvider';
import { ErrorMessageProvider } from '../components/ErrorMessageProvider';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import App from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <SWRConfig
                value={{
                    fetcher: fetchJson,
                    onError: (err) => {
                        console.error(err);
                    },
                }}
            >
                <I18nextProvider i18n={i18n}>
                    <ErrorMessageProvider>
                        <AuthenticationProvider>
                            <Component {...pageProps} />
                        </AuthenticationProvider>
                    </ErrorMessageProvider>
                </I18nextProvider>
            </SWRConfig>
        </Layout>
    );
}
export default MyApp;

MyApp.getInitialProps = async (appContext) => {
    // Legger til ssr på alle sider, for å fikse problem hvor dekoratoren ble statisk generert under bygg,
    // som førte til at den ble utdatert når nav-dekoratoren fikk en ny deploy
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps };
};
