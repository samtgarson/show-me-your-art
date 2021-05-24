import React, { FC, useCallback, useEffect, useState } from 'react'
import { Artist } from '~/src/artists'
import { Btn } from '../button'

export const EmptyModal: FC<{ artist: Artist }> = ({ artist }) => {
  const [copied, setCopied] = useState(false)
  const [share, setShare] = useState(false)

  useEffect(() => setShare('share' in navigator), [])

  const copyCode = useCallback(() => {
    let mounted = true
    const title = `Show Me Your ${artist.name}`
    const url = `https://showmeyour.art/${artist.id}/submit`

    if (share) {
      // eslint-disable-next-line promise/prefer-await-to-then
      navigator.share({ title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(() => mounted && setCopied(false), 2000)
    }

    return () => (mounted = false)
  }, [artist, share])

  return (
    <div className='fixed z-40 text-center bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 normal-text w-max max-w-[90vw] p-14'>
      <img src='/icons/sad.svg' className='mx-auto mb-10' />
      <p className='mb-12'>
        No {artist.name} submissions yet.
        <br />
        Submit yours or let your friend know to submit theirs.
      </p>
      <Btn href={`/${artist.id}/submit`} className='mx-2'>
        Submit yours
      </Btn>
      <Btn onClick={copyCode} className='mx-2' inverted={copied}>
        {copied ? 'Copied' : share ? 'Share code' : 'Copy code'}
      </Btn>
    </div>
  )
}
