import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import Link  from 'next/link'
// todo https://dev.to/fadiamg/multiple-file-inputs-with-one-submit-button-with-react-hooks-kle
    
type FormValues = {
    file: File;
  };
  

const Home: NextPage = () => {
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
    </form>


    <Link href="/dokumentinnsending/opprettsoknadresource">
    this page
</Link>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
