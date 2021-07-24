import cn from 'classnames/bind'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import Link from 'next/link'
import React, { FC, MouseEvent, useState } from 'react'
import styles from '~/src/styles/components/nav.module.scss'

const cx = cn.bind(styles)

export const cornerButtonStyles =
  'relative items-center justify-center hidden h-full px-4 py-3 overflow-hidden text-center bg-white cursor-pointer sm:py-5 sm:px-6 w-28 sm:flex transition-colors duration-500'

const NavMenu: FC<{ onClick(): void, className: string, open: boolean }> = ({
  onClick,
  className,
  open
}) => (
  <motion.button
    layoutId='nav-button'
    className={cn('w-6 h-5 relative', className)}
    onClick={onClick}
  >
    <motion.span className={cx('buttonLine', { buttonLineTop: !open })} />
    <motion.span className={cx('buttonLine', { buttonLineBottom: !open })} />
  </motion.button>
)

const navVariants = {
  wrapper: {
    initial: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    initial: {
      opacity: 0,
      y: -5,
      transition: { ease: 'easeIn' }
    },
    animate: { opacity: 1, y: 0, transition: { ease: 'easeOut' } }
  }
}

export const NavItem: FC<{ href?: string, className?: string }> = ({
  href,
  className,
  children
}) => (
  <motion.li
    variants={navVariants.item}
    className={cn(
      'py-3 sm:my-0 sm:mx-3 last:pb-1 sm:py-1 cursor-pointer',
      className
    )}
  >
    {href ? (
      <Link href={href}>
        <a>{children}</a>
      </Link>
    ) : (
      children
    )}
  </motion.li>
)

const NavItems: FC<{ open: boolean }> = ({ children, open }) => {
  const items = (mobile: boolean) => (
    <motion.ul
      key={`nav-items-${mobile}`}
      variants={navVariants.wrapper}
      initial='initial'
      animate='animate'
      exit='initial'
      className={cn('list-none mt-3 sm:mt-0 z-10', {
        'block sm:hidden': mobile,
        'hidden sm:flex': !mobile
      })}
    >
      {children}
    </motion.ul>
  )

  return (
    <>
      {items(false)}
      <AnimatePresence>{open && items(true)}</AnimatePresence>
    </>
  )
}

export const NavBar: FC<{
  title: JSX.Element
  items: JSX.Element
  cta?: JSX.Element
  hidden?: boolean
  hiddenOnMobile?: boolean
}> = ({ hidden, title, cta, items, hiddenOnMobile }) => {
  const [open, setOpen] = useState(false)

  const navClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'A') setOpen(false)
  }

  return (
    <nav
      className={cn(
        'sm:top-10 sm:left-10 sm:right-10 top-2 left-2 right-2 sm:h-20 fixed z-40 flex items-start h-16 font-bold transition-opacity',
        styles.nav,
        { 'mobile:opacity-0 mobile:pointer-events-none': hiddenOnMobile }
      )}
    >
      <AnimateSharedLayout type='crossfade'>
        <section
          onClick={navClick}
          className={cn(
            'relative py-5 px-5 sm:py-5 sm:px-6 mr-1 flex content-stretch sm:items-center flex-grow sm:h-full transform items-start flex-col sm:flex-row transition-opacity',
            { 'opacity-0 pointer-events-none': hidden }
          )}
        >
          <span
            className={cn(
              'bg-white absolute top-0 left-0 right-0 z-0 transition-all duration-500',
              styles.bg,
              { 'h-18 sm:h-full closed': !open, 'h-full open': open }
            )}
          />
          <div className='z-10 flex items-center w-full sm:mr-auto sm:w-auto transition'>
            {title}
            <NavMenu
              className='block ml-auto sm:hidden'
              onClick={() => setOpen(!open)}
              open={open}
            />
          </div>
          <NavItems open={open}>{items}</NavItems>
        </section>
      </AnimateSharedLayout>{' '}
      {cta}
    </nav>
  )
}
