import cn from 'classnames'
import { motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { FC } from 'react'
import navStyles from '~/src/styles/components/nav.module.scss'

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

type ModalProps = {
  onClose?: () => void
  bottom?: boolean
}

export const Modal: FC<ModalProps> = ({ children, onClose, bottom }) => {
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
      transition={{ type: 'tween' }}
      className={cn(
        'z-40 left-2 sm:left-auto bottom-2 top-2 sm:max-w-2xl sm:w-full right-2 sm:right-10 fixed flex flex-col p-10 pt-20 sm:pt-10 overflow-auto normal-text text-white origin-top-right bg-black sm:max-h-[80vh] sm:min-h-[50vh] items-stretch',
        {
          'sm:top-32 sm:bottom-auto': !bottom,
          'sm:bottom-32 sm:top-auto': bottom
        }
      )}
    >
      {onClose ? (
        <a
          onClick={onClose}
          className='absolute top-0 right-0 w-8 h-6 m-10 sm:hidden'
        >
          <span className={cn(navStyles.buttonLine)} />
          <span className={cn(navStyles.buttonLine)} />
        </a>
      ) : (
        <Link href={`/${artist}`}>
          <a className='absolute top-0 right-0 w-8 h-6 m-10 sm:hidden'>
            <span className={cn(navStyles.buttonLine)} />
            <span className={cn(navStyles.buttonLine)} />
          </a>
        </Link>
      )}
      {children}
    </motion.div>
  )
}
