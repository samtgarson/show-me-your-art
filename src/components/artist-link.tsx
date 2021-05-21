import cn from 'classnames'
import Link from 'next/link'
import React, { FC } from 'react'
import { Artist as IArtist } from 'src/artists'

export const ArtistLink: FC<{ artist: IArtist, className?: string }> = ({
  artist,
  className = ''
}) => {
  return (
    <Link href={`/${artist.id}`}>
      <a
        className={cn(className, 'px-4 py-3 font-bold text-[2vh]')}
        style={{
          background: artist.bg,
          color: `var(--text-${artist.fg})`
        }}
      >
        {artist.name}
      </a>
    </Link>
  )
}
