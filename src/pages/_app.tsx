import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { artists } from '../artists'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const artistVars = Object.values(artists).reduce(
  (styles, artist) => ({
    ...styles,
    [`--${artist.id}`]: artist.bg
  }),
  {}
)

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <main style={artistVars}>
      <Head>
        <title>Show Me Your Art</title>
        <link rel='shortcut icon' href='/mela.png' />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}

export default CustomApp
