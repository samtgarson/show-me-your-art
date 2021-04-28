import { AppProps } from 'next/dist/next-server/lib/router/router'
import '../styles/globals.scss'

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default CustomApp
