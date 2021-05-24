import { motion } from 'framer-motion'
import React, { FC } from 'react'
import { modalVariants } from '../modal'

export const Confirmation: FC = () => (
  <motion.div
    variants={modalVariants.wrapper}
    layout
    transition={{ ease: 'easeOut' }}
    className='flex-grow flex flex-col'
  >
    <h2 className='mb-auto text-xl font-bold'>Thanks for your submission</h2>
    <p className='mb-4 text-sm '>
      We will be in touch if we have any questions about your submission. We vet
      all submissions prior to publishing them. For various reasons some might
      not get published.
    </p>
    <p className='mb-4 text-sm'>
      For the time being, due to the volume of submissions, we can’t inform
      everyone when their submission is published. If yours is and you would
      like to edit or remove it, please get in touch.
    </p>
    <p className='mb-4 text-sm'>
      <a href='mailto:hello@showmeyour.art' className='underline'>
        hello@showmeyour.art
      </a>
    </p>
  </motion.div>
)
