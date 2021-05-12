import cn from 'classnames'
import { motion } from 'framer-motion'
import { useRouter } from 'next/dist/client/router'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ViewportProps } from 'react-map-gl'
import { StateContext } from '../services/state'
import { mapTransition } from '../util/map-data'
import { Map } from './map'

const START_COORDS = { latitude: 51.515579, longitude: -0.12836 }

type MapContainerProps = {
  search: boolean
}

export const MapContainer: FC<MapContainerProps> = ({ search }) => {
  const { start } = useContext(StateContext)
  const { query } = useRouter()
  const { artist = 'enzo' } = query as { artist?: string }
  const [viewport, setViewport] = useState<ViewportProps>({
    ...START_COORDS,
    zoom: 8
  })

  useEffect(() => {
    if (start)
      setViewport({
        ...viewport,
        zoom: 10,
        pitch: 30,
        ...mapTransition(5000)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  const classes = cn({
    'absolute h-screen w-screen left-0 top-0': !search,
    'block h-64 w-96': search
  })

  return (
    <motion.div layoutId="map-wrapper" className={classes}>
      <Map {...{ viewport, setViewport, search, artist }} />
    </motion.div>
  )
}
