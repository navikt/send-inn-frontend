import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  const errorMessage = 'this is an error from frontend at /dev: ' + process.env.NODE_ENV;
  return (
    // <div>
    <div>
      <Head>
        <title>Dev</title>
        {/* Denne siden vil ikke bli indeksert i google pga linjen nedenfor, bør kanskje fjernes etterhvert */}
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <h1>Dev</h1>

        <div>
          <Link href="/dokumentinnsending-default" target="_blank" rel="noopener noreferrer">
            Document submission
          </Link>
        </div>
        <div>
          <Link href="/ettersending-default" target="_blank" rel="noopener noreferrer">
            Additional documents
          </Link>
        </div>
        <div>
          <Link href="/ettersending-saksbehandler" target="_blank" rel="noopener noreferrer">
            Additional documents requested by a caseworker
          </Link>
        </div>
        <div>
          <Link href="/fyll-ut-default" target="_blank" rel="noopener noreferrer">
            FyllUt application
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
