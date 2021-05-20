import React, { FC, useContext } from 'react'
import { StateContext } from '../services/state'
import Masonry from 'react-masonry-css'
import { SubmissionPanel } from './submission-panel'
import { motion } from 'framer-motion'
import { Artist } from '../artists'

const galleryVariants = {
  hidden: { y: 50, opacity: 0, transition: { ease: 'easeIn' } },
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } }
}

export const Gallery: FC<{ artist: Artist }> = () => {
  const { data } = useContext(StateContext)

  return (
    <motion.section
      variants={galleryVariants}
      initial='hidden'
      animate='visible'
      exit='hidden'
      className='z-20 w-screen h-screen fixed top-0 left-0 bg-white overflow-auto overscroll-contain'
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
    </motion.section>
  )
}
