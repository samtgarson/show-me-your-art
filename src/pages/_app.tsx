import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ArtistTransition } from '../components/artist-transition'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()
  /* const { Component: DelayedComponent, props: delayedProps } = useDelayedRender( */
  /*   { Component, props: pageProps } */
  /* ) */

  return (
    <main>
      <Head>
        <title>Show Me Your Art</title>
        <link rel='shortcut icon' href='/mela.png' />
      </Head>
      <ArtistTransition />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={Component.name} />
      </AnimatePresence>
    </main>
  )
}

export default CustomApp
