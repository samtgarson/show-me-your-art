import { motion } from 'framer-motion'
import React, { FC } from 'react'
import { modalVariants } from '../modal'

export const Confirmation: FC = () => (
  <motion.div
    variants={modalVariants.wrapper}
    layout
    transition={{ ease: 'easeOut' }}
  >
    <h2 className='font-bold text-xl mb-48'>Thanks for your submission</h2>
    <h3 className='font-bold mb-4 text-sm'>Please note</h3>
    <p className='mb-4 text-sm'>
      We vet all submissions prior to publishing them. For various reasons some
      do not get published. We will be in touch if we have any questions about
      your submission.{' '}
    </p>
    <p className='mb-4 text-sm'>
      For the time being, due to the volume of submissions, we can’t inform
      everyone when their submission is published. If yours is and you would
      like to edit it, please get in touch.
    </p>
    <p className='mb-4 text-sm'>
      In the meantime, if you have any questions please contact us:&nbsp;
      <a href='mailto:hello@showmeyour.art' className='underline'>
        hello@showmeyour.art
      </a>
    </p>
  </motion.div>
)
