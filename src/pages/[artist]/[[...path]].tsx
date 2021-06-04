import {
  AnimatePresence,
  AnimateSharedLayout,
  usePresence
} from 'framer-motion'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Artist, artists } from '~/src/artists'
import { AboutModal } from '~/src/components/about-modal'
import { Gallery } from '~/src/components/gallery'
import { NavBar } from '~/src/components/nav-bar'
import { SubmitModal } from '~/src/components/submit/submit-modal'
import { DataClient } from '~/src/services/data-client'
import { StateContext } from '~/src/services/state'
import { Submissions } from '~/types/entities'
import dynamic from 'next/dynamic'
import Head from 'next/head'

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

  useEffect(() => {
    !isPresent && safeToRemove && setTimeout(safeToRemove, 1000)
  }, [isPresent, safeToRemove])

  useEffect(() => {
    setPreviousPage(pageRef.current)
    if (['gallery', null].includes(page)) pageRef.current = page || ''
    if (page === null) setShowGallery(false)
    else if (page === 'gallery') setShowGallery(true)
  }, [page])

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
      <NavBar route={page ?? ''} previousRoute={previousPage} artist={artist} />
      <AnimateSharedLayout type='crossfade'>
        <MapContainer artist={artist} search={page == 'submit'} />
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
  const client = DataClient.withCredentials()
  const paths = await Promise.all(
    artistIds.flatMap(async artist => {
      const subs = await client.getSubmissions(artist)
      const r = [
        ...routes.map(path => ({ params: { artist, path: [path] } })),
        ...subs.map(({ id }) => ({
          params: { artist, path: ['submission', id] }
        }))
      ]
      return r
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
  if (routes.includes(page ?? '') || (page === 'submission' && path[0])) {
    return { props: { artist, page, path } }
  }

  return { notFound: true }
}

export default Home
