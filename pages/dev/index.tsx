import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
    const errorMessage =
        'this is an error from frontend at /dev: ' +
        process.env.NODE_ENV;
    return (
        // <div>
        <div>
            <Head>
                <title>Opprett søknad</title>
                {/* Denne siden vil ikke bli indeksert i google pga linjen nedenfor, bør kanskje fjernes etterhvert */}
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            <main>
                <h1>Dev</h1>

                {/* TODO fix trailing comma buggen ... http://localhost:3000/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2," <- ,*/}
                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett søknad
                    </Link>
                </div>
                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett ettersending
                    </Link>
                </div>
                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett ettersending
                    </Link>
                </div>

                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=EN&erEttersendelse=false&vedleggsIder=C1,W1,G2'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett søknad, Engelsk
                    </Link>
                </div>

                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NN&erEttersendelse=false&vedleggsIder=C1,W1,G2'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett søknad, Nynorsk
                    </Link>
                </div>

                <div>
                    <Link
                        href={
                            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Dokumentinnsending - Opprett søknad, uten
                        vedlegg
                    </Link>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => {
                            throw new Error(errorMessage);
                        }}
                    >
                        Throw error
                    </button>
                </div>
            </main>

            <footer></footer>
        </div>
    );
};

export default Home;
