import cn from 'classnames'
import React, { FC } from 'react'
import { Artist as IArtist } from 'src/artists'
import { DelayLink } from './delay-link'

export const ArtistLink: FC<{ artist: IArtist, className?: string }> = ({
  artist,
  className = ''
}) => {
  return (
    <DelayLink
      artist={artist}
      href={`/${artist.id}`}
      className={cn(className, 'px-4 py-3 font-bold text-[2vh]')}
      style={{
        background: artist.bg,
        color: `var(--text-${artist.fg})`
      }}
    >
      {artist.name}
    </DelayLink>
  )
}
