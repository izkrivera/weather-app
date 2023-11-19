import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Weather from '@/components/Weather'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        {/* <link
          rel="icon"
          href="/favicon.ico"
        /> */}
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Weather location="Barcelona, Spain">
          <Weather.Loading />
          <Weather.Error />
          <Weather.Data />
        </Weather>
      </main>
    </>
  )
}
