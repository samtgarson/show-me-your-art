import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ArtistTransition } from '../components/artist-transition'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <main>
      <Head>
        <title>Show Me Your Art</title>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon/favicon-16x16.png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link
          rel='mask-icon'
          href='/favicon/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <meta name='msapplication-TileColor' content='#ff0000' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <ArtistTransition />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={Component.name} />
      </AnimatePresence>
    </main>
  )
}

export default CustomApp
