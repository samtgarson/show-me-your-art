import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ArtistTransition } from '../components/artist-transition'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'
import config from 'next/config'
import { Prelaunch } from '../components/prelaunch'

const {
  publicRuntimeConfig: { prelaunch }
} = config()

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <main>
      <Head>
        <title>Show Me Your Art</title>
        <link rel='shortcut icon' href='/mela.png' />
      </Head>
      {prelaunch ? (
        <Prelaunch />
      ) : (
        <>
          <ArtistTransition />
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={Component.name} />
          </AnimatePresence>
        </>
      )}
    </main>
  )
}

export default CustomApp
