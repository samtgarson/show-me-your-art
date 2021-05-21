import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { AnchorHTMLAttributes, FC, useContext } from 'react'
import { Artist } from '../artists'
import { TransitionState } from '../services/state'

type DelayLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  delay?: number
  href: string
  artist: Artist
}

export const DelayLink: FC<DelayLinkProps> = ({
  delay = 400,
  href,
  children,
  artist,
  ...attrs
}) => {
  const { push } = useRouter()
  const setTransition = useContext(TransitionState)

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setTransition(artist)
    setTimeout(() => push(href), delay)
    setTimeout(() => setTransition(null), 1000)
  }

  return (
    <Link href={href}>
      <a {...attrs} onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}
