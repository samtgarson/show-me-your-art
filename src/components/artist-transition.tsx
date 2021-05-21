import { motion, Variants } from 'framer-motion'
import React, { FC } from 'react'
import { Artist } from '../artists'

type Props = { artist: Artist }

const variants: Record<string, Variants> = {
  item: {
    enter: i => ({
      opacity: 0,
      y: 400 * i,
      transition: { ease: 'easeOut', duration: 0.6 }
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 }
    },
    exit: i => ({
      opacity: 0,
      y: -400 * (3 - i),
      transition: { ease: 'easeIn', duration: 0.5 }
    })
  },
  wrapper: {
    enter: { y: '100vh', transition: { ease: 'easeOut', duration: 0.6 } },
    animate: { y: 0, transition: { ease: 'easeOut', duration: 0.6 } },
    exit: { y: '-100vh', transition: { ease: 'easeIn', duration: 0.5 } }
  }
}

const words = 'Show me your'.split(' ')
export const ArtistTransition: FC<Props> = ({ artist }) => (
  <motion.div
    style={{
      background: artist.bg,
      fontSize: '7vmin',
      color: `var(--text-${artist.fg})`
    }}
    className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center font-bold whitespace-nowrap'
    initial='enter'
    animate='animate'
    exit='exit'
    variants={variants.wrapper}
    transition={{ duration: 0.6 }}
  >
    {words.map((word, i) => (
      <motion.span
        key={word}
        custom={i}
        className='mr-[4vmin]'
        variants={variants.item}
      >
        {word}
      </motion.span>
    ))}
    <motion.span
      custom={3}
      variants={variants.item}
      style={{
        color: artist.bg,
        fontSize: '2.4vmin',
        background: `var(--text-${artist.fg})`
      }}
      className='px-[2vmin] py-[1.5vmin] bg-white'
    >
      {artist.name}
    </motion.span>
  </motion.div>
)
