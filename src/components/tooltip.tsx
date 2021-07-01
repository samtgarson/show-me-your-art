import { motion } from 'framer-motion'
import React, { FC } from 'react'

const tooltipVariants = {
  visible: { opacity: 1, y: 0, x: '-50%' },
  hidden: { opacity: 0, y: 5, x: '-50%' }
}
export const Tooltip: FC = ({ children }) => (
  <motion.span
    variants={tooltipVariants}
    initial='hidden'
    animate='visible'
    exit='hidden'
    transition={{ ease: 'easeOut', duration: 0.2 }}
    className='arrow-down absolute left-1/2 bg-white bottom-[120%] text-black whitespace-nowrap py-3 px-4 text-sm'
  >
    {children}
  </motion.span>
)
