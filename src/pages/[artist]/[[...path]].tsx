import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { GetServerSideProps, NextPage } from 'next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AboutModal } from '~/src/components/about-modal'
import { Gallery } from '~/src/components/gallery'
import { MapContainer } from '~/src/components/map/container'
import { NavBar } from '~/src/components/nav-bar'
import { SubmitModal } from '~/src/components/submit/submit-modal'
import { DataClient } from '~/src/services/data-client'
import { StateContext } from '~/src/services/state'
import { matcher } from '~/src/util/route-matcher'
import { Submissions } from '~/types/entities'

type HomeProps = {
  page: string
  path: string[]
  artist: string
}

const Home: NextPage<HomeProps> = ({ page, artist }) => {
  const [start, setStart] = useState(false)
  const client = DataClient.useClient()
  const [data, setData] = useState<Submissions>({})

  const fetchData = useCallback(async () => {
    const submissions = await client.getSubmissions(artist)
    const newData = submissions.reduce(
      (hsh, sub) => ({ ...hsh, [sub.id]: sub }),
      {}
    )
    setData((d: Submissions) => ({ ...d, ...newData }))
  }, [artist, client])

  useEffect(() => {
    fetchData()
    setTimeout(() => setStart(true), 0)
  }, [fetchData])

  const Page = useMemo(() => {
    switch (page) {
      case 'submit':
        return SubmitModal
      case 'about':
        return AboutModal
      case 'gallery':
        return Gallery
    }
  }, [page])

  return (
    <StateContext.Provider value={{ start, data }}>
      <NavBar />
      <AnimateSharedLayout type='crossfade'>
        <MapContainer search={page == 'submit'} />
        <AnimatePresence>{Page && <Page artist={artist} />}</AnimatePresence>
      </AnimateSharedLayout>
    </StateContext.Provider>
  )
}

const routes = ['', 'about', 'submit', 'gallery', 'submission/*']
const match = matcher(routes)

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  query
}) => {
  if (query.artist !== 'enzo') return { notFound: true }

  const pathParam = (query.path as string[]) ?? []
  const [page = '', ...path] = pathParam
  const route = pathParam.join('/')
  if (!match(route)) return { notFound: true }

  return {
    props: { page, path, artist: query.artist }
  }
}

export default Home
