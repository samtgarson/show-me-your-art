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
    <div className='fixed z-20 flex items-center justify-center w-screen h-screen text-center normal-text animate-fade-in p-4 pointer-events-none'>
      <div className='flex flex-col items-center justify-center max-w-full bg-white pointer-events-auto w-max p-7 sm:p-14 sm:block'>
        <img src='/icons/sad.svg' className='mx-auto mb-10' />
        <p className='mb-12'>
          No {artist.name} submissions yet.
          <br />
          Submit yours or let your friend know to submit theirs.
        </p>
        <Btn href={`/${artist.id}/submit`} className='mx-2 mb-6'>
          Submit yours
        </Btn>
        <Btn onClick={copyCode} className='mx-2' inverted={copied}>
          {copied ? 'Copied' : share ? 'Share link' : 'Copy link'}
        </Btn>
      </div>
    </div>
  )
}
