import React from 'react'
import { AppProps } from 'next/app'
import '../styles/globals.scss'
import { Welcome } from '../components/welcome'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <>
    <Welcome />
    <Component {...pageProps} />
  </>
}

export default CustomApp
