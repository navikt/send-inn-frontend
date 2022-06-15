import Document, {
    DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import {
    fetchDecoratorReact,
    Components,
} from '@navikt/nav-dekoratoren-moduler/ssr';

interface Props {
    Decorator: Components;
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
                            return sheet.collectStyles(
                                <App {...props} />,
                            );
                        },
                });

            const initialProps = await Document.getInitialProps(ctx);
            const Decorator = await fetchDecoratorReact({
                env:
                    process.env.DECORATOR_ENV === 'dev'
                        ? 'dev'
                        : 'prod',
                simple: true,
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
        const { Styles, Scripts, Header, Footer } =
            this.props.Decorator;
        return (
            <Html>
                <Head>
                    <Styles />
                    <Scripts />
                </Head>
                <body>
                    <Header />
                    <Main />
                    <Footer />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
