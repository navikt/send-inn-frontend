import '@navikt/ds-css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { I18nextProvider } from 'react-i18next';
import { SWRConfig } from 'swr';
import { AuthenticationProvider } from '../components/AuthenticationProvider';
import { AxiosInterceptor } from '../components/AxiosInterceptor';
import { ErrorMessageProvider } from '../components/ErrorMessageProvider';
import { LagringsProsessProvider } from '../components/LagringsProsessProvider';
import { Layout } from '../components/Layout';
import i18n from '../i18n';
import fetchJson from '../utils/fetchJson';

if (process.env.API_MOCKING === 'true') {
  import('../mocks');
}
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
            <AxiosInterceptor>
              <AuthenticationProvider>
                <LagringsProsessProvider>
                  <Component {...pageProps} />
                </LagringsProsessProvider>
              </AuthenticationProvider>
            </AxiosInterceptor>
          </ErrorMessageProvider>
        </I18nextProvider>
      </SWRConfig>
    </Layout>
  );
}
export default MyApp;

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Legger til ssr på alle sider, for å fikse problem hvor dekoratoren ble statisk generert under bygg,
  // som førte til at den ble utdatert når nav-dekoratoren fikk en ny deploy
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
