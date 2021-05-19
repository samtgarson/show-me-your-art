import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <>
      <Head>
        <title>Show Me Your Art</title>
        <link rel='shortcut icon' href='/mela.png' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default CustomApp
