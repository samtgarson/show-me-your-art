import {
  AnimatePresence,
  AnimateSharedLayout,
  usePresence
} from 'framer-motion'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Artist, artists } from '~/src/artists'
import { AboutModal } from '~/src/components/about-modal'
import { Gallery } from '~/src/components/gallery'
import { ArtistNav } from '~/src/components/nav/artist-nav'
import { SubmitModal } from '~/src/components/submit/submit-modal'
import { SuggestArtistMapButton } from '~/src/components/suggest-an-artist/map-button'
import { DataClient } from '~/src/services/data-client'
import { StateContext } from '~/src/services/state'
import { Submissions } from '~/types/entities'

const MapContainer = dynamic(
  async () => (await import('~/src/components/map/container')).MapContainer
)

type HomeProps = {
  page: string | null
  path: (string | null)[]
  artist: Artist
}

const Home: NextPage<HomeProps> = ({ page, artist }) => {
  const [start, setStart] = useState(false)
  const client = DataClient.useClient()
  const [data, setData] = useState<Submissions>({})
  const [isPresent, safeToRemove] = usePresence()
  const [showGallery, setShowGallery] = useState(page === 'gallery')
  const pageRef = useRef<string>('')
  const [previousPage, setPreviousPage] = useState<string>('')
  const [showSuggest, setShowSuggest] = useState(true)
  const [selectedId, setSelected] = useState<string | undefined>()
  const selected = selectedId ? data[selectedId] : undefined

  useEffect(() => {
    !isPresent && safeToRemove && setTimeout(safeToRemove, 1000)
  }, [isPresent, safeToRemove])

  useEffect(() => {
    setPreviousPage(pageRef.current)
    if (['gallery', null].includes(page)) pageRef.current = page || ''

    if (page === null) setShowGallery(false)
    else if (page === 'gallery') setShowGallery(true)
    setShowSuggest([null, 'gallery'].includes(page) && !selected)
  }, [page, selected])

  const fetchData = useCallback(async () => {
    const submissions = await client.getSubmissions(artist.id)
    const newData = submissions.reduce(
      (hsh, sub) => ({ ...hsh, [sub.id]: sub }),
      {}
    )
    setData((d: Submissions) => ({ ...d, ...newData }))
  }, [artist, client])

  useEffect(() => {
    fetchData()
    setTimeout(() => setStart(true), 500)
  }, [fetchData])

  const Page = useMemo(() => {
    switch (page) {
      case 'submit':
        return SubmitModal
      case 'about':
        return AboutModal
    }
  }, [page])

  if (!artist) return null
  return (
    <StateContext.Provider value={{ start, data }}>
      <Head>
        <title>Show Me Your {artist.name}</title>
      </Head>
      <ArtistNav
        route={page ?? ''}
        previousRoute={previousPage}
        artist={artist}
        selected={!!selected}
      />
      <AnimateSharedLayout type='crossfade'>
        <AnimatePresence>
          {showSuggest && <SuggestArtistMapButton />}
        </AnimatePresence>
        <MapContainer
          selected={selected}
          setSelected={setSelected}
          artist={artist}
          search={page == 'submit'}
        />
        <AnimatePresence>{Page && <Page artist={artist} />}</AnimatePresence>
        <AnimatePresence>
          {showGallery && <Gallery artist={artist} />}
        </AnimatePresence>
      </AnimateSharedLayout>
    </StateContext.Provider>
  )
}

const routes = ['', 'about', 'submit', 'gallery']
const artistIds = Object.keys(artists)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await Promise.all(
    artistIds.flatMap(async artist => {
      return routes.map(path => ({ params: { artist, path: [path] } }))
    })
  )
  return { paths: paths.flat(), fallback: true }
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ params }) => {
  if (!params) return { notFound: true }

  const { artist: artistId, path: [page, ...path] = [null, null] } = params as {
    artist: string
    path: string[]
  }

  const artist = artists[artistId]
  if (!artist) return { notFound: true }
  if (routes.includes(page ?? '')) {
    return { props: { artist, page, path } }
  }

  return { notFound: true }
}

export default Home
