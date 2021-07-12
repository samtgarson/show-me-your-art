import { AnimatePresence, motion } from 'framer-motion'
import React, { FC, useState } from 'react'
import { SuggestArtistModal } from './modal'

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export const SuggestArtistMapButton: FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        variants={variants}
        initial='initial'
        animate='animate'
        exit='initial'
        transition={{ type: 'tween' }}
        className='px-4 py-3 bg-white cursor-pointer sm:py-5 sm:px-6 font-bold uppercase h-16 sm:h-20 sm:bottom-10 sm:right-10 bottom-2 right-2 fixed z-40'
      >
        {open ? 'Close' : 'Suggest an artist'}
      </motion.button>
      <AnimatePresence>
        {open && <SuggestArtistModal bottom onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
