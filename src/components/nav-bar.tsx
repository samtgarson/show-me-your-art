import cn from 'classnames/bind'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import React, { FC, useState } from "react"
import styles from '~/src/styles/components/nav.module.scss'

const cx = cn.bind(styles)

const NavMenu: FC<{ onClick (): void, className: string, open: boolean }> = ({ onClick, className, open }) => (
  <motion.button layoutId="nav-button" className={cn("w-5 h-5 relative", className)} onClick={onClick}>
    <motion.span className={cx('buttonLine', { buttonLineTop: !open })} />
    <motion.span className={cx('buttonLine', { buttonLineBottom: !open })} />
  </motion.button>
)

const navVariants = {
  wrapper: {
    initial: { opacity: 0, transition: { staggerChildren: 0.1 } },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  },
  item: {
    initial: { opacity: 0, y: -5, transition: { ease: 'easeOut' } },
    animate: { opacity: 1, y: 0 }
  }
}

const NavItems: FC<{ mobile?: boolean }> = ({ mobile = false }) => (
  <motion.ul
    className={cn("list-none mt-5 sm:mt-0", { 'block sm:hidden': mobile, 'hidden sm:flex': !mobile })}
    variants={mobile ? navVariants.wrapper : {}}
    initial='initial'
    animate='animate'
    exit='initial'
  >
    <motion.li variants={navVariants.item} className="my-2 sm:my-0 sm:mx-3"><a>View gallery</a></motion.li>
    <motion.li variants={navVariants.item} className="my-2 sm:my-0 sm:mx-3"><a>About</a></motion.li>
  </motion.ul>
)

export const NavBar: FC = () => {
  const [open, setOpen] = useState(false)

  return <nav className="fixed sm:top-10 sm:left-10 sm:right-10 top-2 left-2 right-2 z-40 font-bold flex items-start">
    <AnimateSharedLayout type="crossfade">
      <motion.section layout className="bg-white py-3 px-4 sm:py-5 sm:px-6 mr-1 sm:flex flex-grow">
        <div className="flex sm:mr-auto">
          <motion.h1 layoutId="nav-title" className="mr-auto">Show me your <u>Enzo</u></motion.h1>
          <NavMenu className="block sm:hidden" onClick={() => setOpen(!open)} open={open} />
        </div>
        <NavItems />
        <AnimatePresence>{ open && <NavItems mobile /> }</AnimatePresence>
      </motion.section>
    </AnimateSharedLayout>
    <a className="bg-white py-3 px-4 sm:py-5 sm:px-6">Submit</a>
  </nav>
}
