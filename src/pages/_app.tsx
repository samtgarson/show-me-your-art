import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useState } from 'react'
import { Artist } from '../artists'
import { ArtistTransition } from '../components/artist-transition'
import { TransitionState } from '../services/state'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()
  const [transitionArtist, setTransition] = useState<Artist | null>(null)

  return (
    <main>
      <Head>
        <title>Show Me Your Art</title>
        <link rel='shortcut icon' href='/mela.png' />
      </Head>
      <AnimatePresence>
        {transitionArtist && <ArtistTransition artist={transitionArtist} />}
      </AnimatePresence>
      <TransitionState.Provider value={setTransition}>
        <Component {...pageProps} />
      </TransitionState.Provider>
    </main>
  )
}

export default CustomApp
