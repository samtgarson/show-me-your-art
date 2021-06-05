import Link from 'next/link'
import React, { FC, useContext } from 'react'
import { Artist } from '~/src/artists'
import { StateContext } from '~/src/services/state'
import { cornerButtonStyles, NavBar, NavItem } from './nav-bar'

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

export const ArtistNav: FC<{
  artist: Artist
  route: string
  previousRoute: string
}> = ({ artist, route, previousRoute }) => {
  const { data } = useContext(StateContext)
  const showMainNav = Object.keys(data).length > 0
  const slug = artist.id
  const mainNav =
    route == 'gallery' ? (
      <NavItem href={`/${slug}`}>View map</NavItem>
    ) : (
      <NavItem href={`/${slug}/gallery`}>View gallery</NavItem>
    )

  const hidden = ['about', 'submit'].includes(route)

  return (
    <NavBar
      title={<HomeButton artist={artist} />}
      items={
        <>
          <NavItem className='sm:hidden' href={`/${slug}`}>
            Home
          </NavItem>
          {showMainNav && mainNav}
          <NavItem href={`/${slug}/about`}>About</NavItem>
          <NavItem className='sm:hidden' href={`/${slug}/submit`}>
            Submit
          </NavItem>
        </>
      }
      cta={
        <Link
          href={
            hidden ? `/${artist.id}/${previousRoute}` : `/${artist.id}/submit`
          }
        >
          <a className={cornerButtonStyles}>{hidden ? 'Close' : 'Submit'}</a>
        </Link>
      }
      hidden={hidden}
    />
  )
}
