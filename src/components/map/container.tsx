import { motion } from 'framer-motion'
import config from 'next/config'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ViewportProps } from 'react-map-gl'
import { StateContext } from 'src/services/state'
import { mapTransition } from 'src/util/map-data'
import { Artist } from '~/src/artists'
import { SubmissionWithMeta } from '~/types/entities'
import { EmptyModal } from './empty-modal'
import { Map } from './map'

const START_COORDS = { latitude: 51.515579, longitude: -0.12836 }

type MapContainerProps = {
  search: boolean
  artist: Artist
  setSelected(id?: string): void
  selected?: SubmissionWithMeta
}

const {
  publicRuntimeConfig: { mapboxApiToken }
} = config()

export const MapContainer: FC<MapContainerProps> = ({
  search,
  artist,
  selected,
  setSelected
}) => {
  const { start, data } = useContext(StateContext)
  const [viewport, setViewport] = useState<ViewportProps>({
    ...START_COORDS,
    zoom: 8
  })

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
      className='absolute top-0 left-0 w-screen h-screen'
    >
      {Object.keys(data).length === 0 && <EmptyModal artist={artist} />}
      <Map
        {...{
          viewport,
          setViewport,
          search,
          selected,
          setSelected,
          token: mapboxApiToken,
          artist
        }}
      />
    </motion.div>
  )
}
