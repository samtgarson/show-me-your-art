import { motion } from 'framer-motion'
import React, { FC } from 'react'
import cn from 'classnames'
import navStyles from '~/src/styles/components/nav.module.scss'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

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

export const Modal: FC = ({ children }) => {
  const {
    query: { artist = '' }
  } = useRouter()
  return (
    <motion.div
      layout
      variants={modalVariants.modal}
      initial='hidden'
      animate='visible'
      exit='hidden'
      className='z-40 left-2 sm:left-auto top-2 bottom-2 sm:bottom-auto sm:top-32 sm:max-w-xl sm:w-full right-2 sm:right-10 fixed flex flex-col items-start justify-start p-10 pt-20 sm:pt-10 overflow-auto tracking-normal text-white normal-case origin-top-right bg-black sm:max-h-[80vh] sm:min-h-[50vh]'
    >
      <Link href={`/${artist}`}>
        <a className='w-8 h-6 absolute top-0 right-0 m-10 sm:hidden'>
          <span className={cn(navStyles.buttonLine)} />
          <span className={cn(navStyles.buttonLine)} />
        </a>
      </Link>
      {children}
    </motion.div>
  )
}
