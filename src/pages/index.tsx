import cn from 'classnames'
import { usePresence } from 'framer-motion'
import { NextPage } from 'next'
import config from 'next/config'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import styles from 'src/styles/pages/home.module.scss'
import { artists } from '../artists'
import { ArtistLink } from '../components/artist-link'
import { Marquee } from '../components/marquee'
import { Prelaunch } from '../components/prelaunch'

const {
  publicRuntimeConfig: { prelaunch }
} = config()

const words = 'Show Me Your Art'.split(' ')
const list = Object.values(artists)

const Landing: NextPage = () => {
  const [isPresent, safeToRemove] = usePresence()
  const { query } = useRouter()
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    !isPresent && safeToRemove && setTimeout(safeToRemove, 1000)
  }, [isPresent, safeToRemove])

  const items = [...words, ...words].map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <ArtistLink
        className={cn('flex-shrink-0 transition', styles.item)}
        artist={list[(i + list.length) % list.length]}
      />
      <div
        className={cn('block py-4 mx-12 font-bold transition', styles.item)}
        style={{ fontSize: '10vh', lineHeight: 1 }}
      >
        {word}
      </div>
    </Fragment>
  ))

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (prelaunch && !('preview' in query)) return <Prelaunch />
  return (
    <section
      className={cn(
        'h-screen flex flex-col sm:justify-center justify-start items-start sm:items-stretch pt-[30vh] sm:pt-0'
      )}
    >
      <div className={cn(styles.section, 'hidden sm:block')}>
        <Marquee offset={0} duration={220}>
          {items}
        </Marquee>
        <Marquee reverse offset={16} duration={200}>
          {items}
        </Marquee>
        <Marquee duration={150} offset={33}>
          {items}
        </Marquee>
        {showHint && (
          <p className='fixed left-0 right-0 text-sm text-center bottom-10 normal-text animate-fade-in'>
            Tap on an artist.
          </p>
        )}
      </div>
      {list.map(artist => (
        <ArtistLink artist={artist} key={artist.id} className='sm:hidden' />
      ))}
    </section>
  )
}

export default Landing
