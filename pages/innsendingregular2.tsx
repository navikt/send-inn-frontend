import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';


type FormValues = {
    filnavn: string;
    file: File;
  };
  

const Home: NextPage = () => {
 
   // const [files, setFiles] = useState<File[] | []>([])
    /*
   const [files, setFiles] = useState<FormValues>([]);

   */ 


   const [files , setFiles] = useState<FormValues[]>([]); 

    function addFile(input : FormValues) {
        setFiles(files.concat(input))
    }    
      const { register, handleSubmit } = useForm<FormValues>();
      /*
      const {files : FormValues[], setFiles} = useState([])
      */
      const onSubmit: SubmitHandler<FormValues> = data => { console.log(data);
        addFile(data)
        console.log(data)

    }
  return (
    <div className={styles.container}>
      <Head>
        <title>Send inn her</title>
        <meta name="description" content="Her kan du sende inn vedlegg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {files.map((input , index) => (
        <p key={index}>{index} : {input.filnavn + ' ' + input.file.toString()} </p>
      ))}

      <main className={styles.main}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("filnavn")} />
      <input type="file" {...register("file")} />

      <input type="submit" />
    </form>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
