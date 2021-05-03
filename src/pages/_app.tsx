import React, { createContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/globals.scss'
import { Welcome } from '../components/welcome'

export const StateContext = createContext({ start: false })

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [start, setStart] = useState(false)

  useEffect(() => {
    setTimeout(() => setStart(true), 1000)
  }, [])

  return <StateContext.Provider value={{ start }}>
    <Head>
      <title>Show Me Your Enzo</title>
      <link rel="shortcut icon" href="/mela.png" />
    </Head>
    <Welcome show={!start} />
    <Component {...pageProps} />
  </StateContext.Provider>
}

export default CustomApp
