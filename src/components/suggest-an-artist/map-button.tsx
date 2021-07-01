import { AnimatePresence } from 'framer-motion'
import React, { FC, useState } from 'react'
import { SuggestArtistModal } from './modal'

export const SuggestArtistMapButton: FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className='px-4 py-3 bg-white cursor-pointer sm:py-5 sm:px-6 sm:bottom-10 sm:right-10 bottom-2 right-2 fixed z-40 font-bold uppercase h-16 sm:h-20'
      >
        {open ? 'Close' : 'Suggest an artist'}
      </button>
      <AnimatePresence>
        {open && <SuggestArtistModal bottom onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
