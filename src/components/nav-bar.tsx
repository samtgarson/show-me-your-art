import cn from 'classnames/bind'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import Link from 'next/link'
import React, { FC, MouseEvent, useState } from 'react'
import styles from '~/src/styles/components/nav.module.scss'
import { Artist } from '../artists'

const cx = cn.bind(styles)

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
      transition: { staggerChildren: 0.1, staggerDirection: -1 }
    },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
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

const NavItem: FC<{ href: string }> = ({ href, children }) => (
  <motion.li
    variants={navVariants.item}
    className='py-3 sm:my-0 sm:mx-3 last:pb-1'
  >
    <Link href={href}>
      <a>{children}</a>
    </Link>
  </motion.li>
)

const NavItems: FC<{ mobile?: boolean, route: string, artist: string }> = ({
  mobile = false,
  route,
  artist
}) => {
  return (
    <motion.ul
      variants={navVariants.wrapper}
      initial='initial'
      animate='animate'
      exit='initial'
      className={cn('list-none mt-3 sm:mt-0 z-10', {
        'block sm:hidden': mobile,
        'hidden sm:flex': !mobile
      })}
    >
      {mobile && <NavItem href={`/${artist}`}>Home</NavItem>}
      {route == 'gallery' ? (
        <NavItem href={`/${artist}`}>View map</NavItem>
      ) : (
        <NavItem href={`/${artist}/gallery`}>View gallery</NavItem>
      )}
      <NavItem href={`/${artist}/about`}>About</NavItem>
      {mobile && <NavItem href={`/${artist}/submit`}>Submit</NavItem>}
    </motion.ul>
  )
}

export const NavBar: FC<{ artist: Artist, route: string }> = ({
  artist,
  route
}) => {
  const [open, setOpen] = useState(false)

  const hidden = ['about', 'submit'].includes(route)

  const navClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'A') setOpen(false)
  }

  return (
    <nav
      className={cn(
        'sm:top-10 sm:left-10 sm:right-10 top-2 left-2 right-2 sm:h-20 fixed z-40 flex items-start h-16 font-bold',
        styles.nav,
        route
      )}
    >
      <AnimateSharedLayout type='crossfade'>
        <section
          onClick={navClick}
          className={cn(
            'relative py-6 px-5 sm:py-5 sm:px-6 mr-1 flex content-stretch sm:items-center flex-grow transition sm:h-full transform items-start flex-col sm:flex-row',
            { 'opacity-0 -translate-y-2 pointer-events-none': hidden }
          )}
        >
          <span
            className={cn(
              'bg-white absolute top-0 left-0 right-0 z-0 transition-all duration-500',
              styles.bg,
              { 'h-18 sm:h-full closed': !open, 'h-full open': open }
            )}
          />
          <div className='z-10 flex w-full sm:mr-auto sm:w-auto transition'>
            <h1 className='mr-auto'>
              <Link href='/'>
                <a>
                  Show me your{' '}
                  <span
                    className='px-3 py-2 text-sm text-white'
                    style={{ background: artist.bg }}
                  >
                    {artist.name}
                  </span>
                </a>
              </Link>
            </h1>
            <NavMenu
              className='block ml-auto sm:hidden'
              onClick={() => setOpen(!open)}
              open={open}
            />
          </div>
          <NavItems artist={artist.id} route={route} />
          <AnimatePresence>
            {open && <NavItems artist={artist.id} route={route} mobile />}
          </AnimatePresence>
        </section>
      </AnimateSharedLayout>{' '}
      <Link href={hidden ? `/${artist.id}` : `/${artist.id}/submit`} passHref>
        <a className='relative items-center hidden h-full px-4 py-3 overflow-hidden text-center bg-white sm:py-5 sm:px-6 w-28 sm:flex transition-colors duration-500'>
          {hidden ? 'Close' : 'Submit'}
        </a>
      </Link>
    </nav>
  )
}
