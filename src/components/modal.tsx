import { motion } from 'framer-motion'
import React, { FC } from 'react'

export const modalVariants = {
  modal: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  },
  wrapper: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
}

export const Modal: FC = ({ children }) => (
  <motion.div
    layout
    variants={modalVariants.modal}
    initial='hidden'
    animate='visible'
    exit='hidden'
    className='fixed left-2 sm:left-auto top-16 bottom-2 sm:bottom-auto overflow-auto sm:overflow-hidden sm:top-28 bg-black p-10 text-white normal-case tracking-normal sm:max-w-xl sm:w-full right-2 sm:right-10 origin-top-right'
  >
    {children}
  </motion.div>
)
