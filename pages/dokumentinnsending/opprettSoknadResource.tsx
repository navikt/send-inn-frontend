import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next'
// todo https://dev.to/fadiamg/multiple-file-inputs-with-one-submit-button-with-react-hooks-kle
    
type FormValues = {
    file: File;
  };
  //https://tjenester-q1.nav.no/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1
  //http://localhost:3000/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1,
// todo make the url case insensitive?
// todo get qparams    https://reactgo.com/next-get-query-params/   <p>{query.name}</p>

/* 
interface PropStructure{
  firstName: string;
  lastName: number;
}



interface Props {
  somevalue?: string;
}

 */
const OpprettSoknadResource: NextPage = () => {
  const { query } = useRouter();

    const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

      const { register, handleSubmit } = useForm<FormValues>();
      const onSubmit: SubmitHandler<FormValues> = data => { 
          setFilesUploaded(filesUploaded => [...filesUploaded, data.file])
          console.log(data);
          console.log(filesUploaded)
      }
  return (
    <div className={styles.container}>

      <Head>
        <title>Send inn her</title>
        <meta name="description" content="Her kan du sende inn vedlegg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register("file")} />

      <input type="submit" /> 
      <div> {JSON.stringify(query)} </div>
      <p>{query.skjemanummer}</p>
      <p>{query.erEttersendelse}</p>
      <p>{query.vedleggsIder}</p>
      {/*
      https://tjenester-q1.nav.no/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1]&brukerid=12345678901&sprak=NO_NB&vedleggListe=W1,W2
      opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1]&brukerid=12345678901&sprak=NO_NB&vedleggListe=W1,W2
      ting vi har:
      skjemanummer=NAV%2054-00
      erEttersendelse=false
      vedleggsIder=W2,W1
      

      brukerid=12345678901
      sprak=NO_NB
      vedleggListe=W1,W2 (samme som vedleggsliste)
      */}

</form>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

/*
export const getServerSideProps: GetServerSideProps = async (context) => {
  // get whatever you can get from the service at rendertime here  
  // return {props: {hello: 'hello'}}
  prop : Props = {somevalue = 'string'}
  return prop
}
*/    


export default OpprettSoknadResource
