import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useFathom = (): void => {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('YCOKBNWU', {
      includedDomains: ['show-me-your-art.samgarson.com', 'showmeyour.art'],
      url: 'https://prawn.samgarson.com/script.js'
    })

    function onRouteChangeComplete () {
      Fathom.trackPageview()
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])
}
