import { motion } from 'framer-motion'
import config from 'next/config'
import { useRouter } from 'next/dist/client/router'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ViewportProps } from 'react-map-gl'
import { StateContext } from 'src/services/state'
import { mapTransition } from 'src/util/map-data'
import { Artist } from '~/src/artists'
import { Map } from './map'

const START_COORDS = { latitude: 51.515579, longitude: -0.12836 }

type MapContainerProps = {
  search: boolean
  artist: Artist
}

const {
  publicRuntimeConfig: { mapboxApiToken }
} = config()

export const MapContainer: FC<MapContainerProps> = ({ search, artist }) => {
  const { start } = useContext(StateContext)
  const [viewport, setViewport] = useState<ViewportProps>({
    ...START_COORDS,
    zoom: 8
  })
  const {
    query: { path = [] },
    push
  } = useRouter()
  const [route, param] = path as string[]
  const selectedId = route === 'submission' ? param : undefined
  const setSelected = (id?: string) => {
    if (!id) push(`/${artist.id}`)
    else push(`/${artist.id}/submission/${id}`)
  }

  useEffect(() => {
    if (start)
      setViewport(vp => ({
        ...vp,
        zoom: 10,
        pitch: 30,
        ...mapTransition(5000)
      }))
  }, [start])

  return (
    <motion.div
      layoutId='map-wrapper'
      className='absolute h-screen w-screen left-0 top-0'
    >
      <Map
        {...{
          viewport,
          setViewport,
          search,
          selectedId,
          setSelected,
          token: mapboxApiToken,
          artist
        }}
      />
    </motion.div>
  )
}
