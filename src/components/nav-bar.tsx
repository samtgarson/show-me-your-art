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

const HomeButton: FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <h1 className='flex items-center mr-auto overflow-hidden'>
      <Link href='/'>
        <a className='flex items-center'>
          <span className='hidden sm:block sm:-ml-5 translate-x-0 hover:translate-x-5 transform transition-transform ease-out'>
            <svg
              width='6'
              height='11'
              viewBox='0 0 6 11'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='sm:inline-block mr-5 hidden'
            >
              <path
                d='M5.14295 10.3799L0.997954 6.23488L0.292954 5.52988L0.997954 4.82488L5.14295 0.674878C5.23711 0.580726 5.3648 0.527832 5.49795 0.527832C5.6311 0.527832 5.7588 0.580726 5.85295 0.674878C5.94711 0.76903 6 0.896727 6 1.02988C6 1.16303 5.94711 1.29073 5.85295 1.38488L1.70295 5.52988L5.84795 9.67488C5.92987 9.77053 5.97267 9.89357 5.96781 10.0194C5.96295 10.1452 5.91078 10.2646 5.82174 10.3537C5.73269 10.4427 5.61332 10.4949 5.48748 10.4997C5.36164 10.5046 5.2386 10.4618 5.14295 10.3799Z'
                fill='black'
              />
            </svg>
            Show me your
          </span>
          <span
            className='z-10 px-3 py-2 text-sm sm:ml-3'
            style={{ background: artist.bg, color: `var(--text-${artist.fg})` }}
          >
            {artist.name}
          </span>
        </a>
      </Link>
    </h1>
  )
}

const cornerButtonStyles =
  'relative items-center justify-center hidden h-full px-4 py-3 overflow-hidden text-center bg-white cursor-pointer sm:py-5 sm:px-6 w-28 sm:flex transition-colors duration-500'

export const NavBar: FC<{
  artist: Artist
  route: string
  previousRoute: string
}> = ({ artist, route, previousRoute }) => {
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
            'relative py-5 px-5 sm:py-5 sm:px-6 mr-1 flex content-stretch sm:items-center flex-grow transition-opacity sm:h-full transform items-start flex-col sm:flex-row',
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
            <HomeButton artist={artist} />
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
      <Link
        href={
          hidden ? `/${artist.id}/${previousRoute}` : `/${artist.id}/submit`
        }
      >
        <a className={cornerButtonStyles}>{hidden ? 'Close' : 'Submit'}</a>
      </Link>
    </nav>
  )
}
