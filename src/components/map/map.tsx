import cn from 'classnames'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { FC, useContext, useEffect, useRef } from 'react'
import ReactMapGL, {
  Layer,
  MapRef,
  NavigationControl,
  Popup,
  Source,
  ViewportProps
} from 'react-map-gl'
import { SubmissionPanel } from 'src/components/submission-panel'
import { StateContext } from 'src/services/state'
import styles from 'src/styles/components/map.module.scss'
import {
  getPopupLocation,
  layerStyles,
  mapTransition,
  toGeoJson
} from 'src/util/map-data'
import { useMarkers } from 'src/util/use-map-markers'
import { Artist } from '~/src/artists'

type MapProps = {
  viewport: ViewportProps
  setViewport(
    viewport: ViewportProps | ((viewport: ViewportProps) => ViewportProps)
  ): void
  search: boolean
  artist: Artist
  selectedId?: string
  setSelected(id?: string): void
  token: string
}

export const Map: FC<MapProps> = ({
  viewport,
  setViewport,
  search,
  artist,
  selectedId,
  setSelected,
  token
}) => {
  const { data } = useContext(StateContext)
  const json = data && toGeoJson(data)
  const mapRef = useRef<MapRef>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const selected = selectedId ? data[selectedId] : undefined
  const { markers } = useMarkers({
    viewport,
    setViewport,
    artist,
    hidden: search,
    selected,
    setSelected,
    mapRef: mapRef.current
  })

  useEffect(() => {
    setViewport(vp => ({
      ...vp,
      ...getPopupLocation(mapRef, selected, popupRef),
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
        {selected && (
          <Popup
            longitude={selected.coordinates.longitude}
            latitude={selected.coordinates.latitude}
            onClose={setSelected}
            anchor='left'
            tipSize={0}
            className={styles.popup}
            closeButton={false}
          >
            <SubmissionPanel
              ref={popupRef}
              submission={selected}
              className='sm:p-6 p-4 w-[50vh] max-w-[90vw]'
            />
          </Popup>
        )}
      </>
    </ReactMapGL>
  )
}
