import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ArtistTransition } from '../components/artist-transition'
import '../styles/globals.scss'
import { useFathom } from '../util/use-fathom'

const title = 'Show Me Your Art'
const description =
  'Show Me Your Art is celebrating the artist, the art travelling the world and the appreciation of it in our spaces. A side project by @jamingalea and @samtgarson'
const image = 'https://showmeyour.art/preview.jpeg'

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useFathom()

  return (
    <main>
      <Head>
        <title>{title}</title>
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
        <meta name='theme-color' content='#ffffff' />

        <meta name='description' content={description} />

        <meta property='og:url' content='https://showmeyour.art' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={image} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:creator' content='@jamingalea' />
        <meta property='twitter:site' content='@showmeyour_art' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={image} />
      </Head>
      <ArtistTransition />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={Component.name} />
      </AnimatePresence>
    </main>
  )
}

export default CustomApp
