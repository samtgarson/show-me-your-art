import React, { FC } from 'react'
import cn from 'classnames'
import { Artist as IArtist } from 'src/artists'
import Link from 'next/link'

export const ArtistLink: FC<{ artist: IArtist, className?: string }> = ({
  artist,
  className = ''
}) => (
  <Link href={`/${artist.id}`}>
    <a
      className={cn(className, 'px-4 py-3 font-bold')}
      style={{
        background: `var(--${artist.id})`,
        color: `var(--text-${artist.fg})`,
        fontSize: '2vh'
      }}
    >
      {artist.name}
    </a>
  </Link>
)
