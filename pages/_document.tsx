import { DecoratorComponents, fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import getConfig from 'next/config';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const { publicRuntimeConfig } = getConfig();

interface Props {
  Decorator: DecoratorComponents;
}
export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) =>
            function EnhanceApp(props) {
              return sheet.collectStyles(<App {...props} />);
            },
        });

      const initialProps = await Document.getInitialProps(ctx);
      const Decorator = await fetchDecoratorReact({
        env: process.env.DECORATOR_ENV === 'dev' ? 'dev' : 'prod',
        params: {
          simple: true,
          logoutUrl: publicRuntimeConfig.basePath + '/oauth2/logout',
          logoutWarning: true,
        },
      });
      return {
        ...initialProps,
        Decorator,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    const { Styles, Scripts, Header, Footer } = this.props.Decorator;

    const disableDecorator = process.env.DECORATOR_DISABLED !== 'true';
    return (
      <Html style={{ scrollBehavior: 'smooth' }}>
        <Head>{disableDecorator && <Styles />}</Head>
        <body>
          {disableDecorator && <Header />}
          <Main />
          {disableDecorator && <Footer />}
          <NextScript />
          {disableDecorator && <Scripts />}
        </body>
      </Html>
    );
  }
}
