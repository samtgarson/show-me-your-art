import React, { FC, useContext } from 'react'
import { StateContext } from '../services/state'
import Masonry from 'react-masonry-css'
import { SubmissionPanel } from './submission-panel'
import { motion } from 'framer-motion'
import { Artist } from '../artists'
import { useRouter } from 'next/router'
import { Btn } from './button'

const galleryVariants = {
  hidden: { y: 50, opacity: 0, transition: { ease: 'easeIn' } },
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } }
}

export const Gallery: FC<{ artist: Artist }> = () => {
  const { data } = useContext(StateContext)
  const { query } = useRouter()
  const { artist } = query as { artist: string }

  return (
    <>
      <motion.section
        variants={galleryVariants}
        initial='hidden'
        animate='visible'
        exit='hidden'
        className='fixed top-0 left-0 z-20 w-screen h-screen overflow-auto bg-white overscroll-contain'
      >
        <Masonry
          breakpointCols={{ default: 3, 1024: 3, 768: 2, 640: 1 }}
          className='flex w-auto -ml-2'
          columnClassName='pl-2 stagger animate-fade-in'
        >
          {Object.values(data).map(sub => (
            <SubmissionPanel submission={sub} key={sub.id} />
          ))}
        </Masonry>
        <footer className='flex flex-col items-center justify-center px-12 py-16 pt-32'>
          <Btn href={`/${artist}`}>Go back to map</Btn>
          <p className='normal-text'>
            A project by{' '}
            <a className='underline' href='https://samgarson.com'>
              Sam Garson
            </a>{' '}
            and{' '}
            <a className='underline' href='https://jamingalea.com'>
              Jamin Galea
            </a>{' '}
            &bull;{' '}
            <a className='underline' href='mailto:hello@showmeyour.art'>
              hello@showmeyour.art
            </a>
          </p>
        </footer>
      </motion.section>
    </>
  )
}
