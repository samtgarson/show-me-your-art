import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { FC, useEffect, useRef } from 'react'
import ReactMapGL, {
  Layer,
  MapRef,
  NavigationControl,
  Popup,
  Source,
  ViewportProps
} from 'react-map-gl'
import styles from 'src/styles/components/map.module.scss'
import { getPopupLocation, layerStyles, mapTransition } from 'src/util/map-data'
import { useMarkers } from 'src/util/use-map-markers'
import { Artist } from '~/src/artists'
import { SubmissionWithMeta } from '~/types/entities'
import { PanelWrapper } from './panel-wrapper'

type MapProps = {
  viewport: ViewportProps
  setViewport(
    viewport: ViewportProps | ((viewport: ViewportProps) => ViewportProps)
  ): void
  search: boolean
  artist: Artist
  selected?: SubmissionWithMeta
  setSelected(id?: string): void
  token: string
}

export const Map: FC<MapProps> = ({
  viewport,
  setViewport,
  search,
  artist,
  selected,
  setSelected,
  token
}) => {
  const mapRef = useRef<MapRef>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const { markers, json } = useMarkers({
    viewport,
    setViewport,
    artist,
    hidden: search,
    selected,
    setSelected,
    mapRef: mapRef
  })

  useEffect(() => {
    const latLong =
      window.innerWidth <= 640
        ? selected?.coordinates
        : getPopupLocation(mapRef, selected, popupRef)
    setViewport(vp => ({
      ...vp,
      ...latLong,
      ...mapTransition(2000)
    }))
  }, [selected, setViewport])

  return (
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      mapboxApiAccessToken={token}
      onViewportChange={(nextViewport: ViewportProps) => {
        search || setViewport(nextViewport)
      }}
      onClick={_ => setSelected(undefined)}
      width='100%'
      height='100%'
      className={cn({ 'cursor-default pointer-events-none': search })}
    >
      <NavigationControl className={styles.zoom} showCompass={false} />
      <Source
        cluster={true}
        clusterProperties={{}}
        id='submissions'
        type='geojson'
        data={json}
      >
        {layerStyles.map(layerStyle => (
          <Layer key={layerStyle.id} {...layerStyle} />
        ))}
      </Source>

      <>
        {markers}
        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected()}
              className='z-30 bg-white sm:hidden w-16 h-16 flex items-center justify-center fixed right-2 top-2'
            >
              <img src='/icons/close-dark.svg' className='w-9 h-9' />
            </motion.button>
          )}
        </AnimatePresence>
        {selected && (
          <Popup
            longitude={selected.coordinates.longitude}
            latitude={selected.coordinates.latitude}
            onClose={setSelected}
            anchor='left'
            tipSize={0}
            className={styles.popup}
            closeButton={false}
            closeOnClick={false}
          >
            <PanelWrapper ref={popupRef} submission={selected} />
          </Popup>
        )}
      </>
    </ReactMapGL>
  )
}
