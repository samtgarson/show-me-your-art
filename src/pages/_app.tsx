import React, { createContext, useEffect, useState } from 'react'
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
    <Welcome show={!start} />
    <Component {...pageProps} />
  </StateContext.Provider>
}

export default CustomApp
