import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useForm, SubmitHandler } from "react-hook-form";

const Home: NextPage = () => {

    const { register, handleSubmit } = useForm() 

    const onSubmit: SubmitHandler = (data : String) => {
        console.log(data)
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
      <input ref={register} type="file" name="picture" />
      <button>Submit</button>
    </form>
      
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
