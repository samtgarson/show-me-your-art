import cn from 'classnames'
import 'mapbox-gl/dist/mapbox-gl.css'
import config from 'next/config'
import React, { FC, useContext, useMemo } from 'react'
import ReactMapGL, { Layer, Popup, Source, ViewportProps } from 'react-map-gl'
import { StateContext } from '../services/state'
import styles from '../styles/components/map.module.scss'
import { layerStyles, toGeoJson } from '../util/map-data'
import { useMarkers } from '../util/use-map-markers'
import { SubmissionPanel } from './submission-panel'

const {
  publicRuntimeConfig: { mapboxApiToken }
} = config()

type MapProps = {
  viewport: ViewportProps
  setViewport(viewport: ViewportProps): void
  search: boolean
  artist: string
}

export const Map: FC<MapProps> = ({
  viewport,
  setViewport,
  search,
  artist
}) => {
  const { data } = useContext(StateContext)
  const json = useMemo(() => data && toGeoJson(data), [data])
  const { markers, selected, setSelected, mapRef } = useMarkers({
    viewport,
    setViewport,
    artist,
    hidden: search
  })

  return (
    <>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapboxApiAccessToken={mapboxApiToken}
        onViewportChange={(nextViewport: ViewportProps) => {
          search || setViewport(nextViewport)
        }}
        onClick={_ => setSelected(undefined)}
        width='100%'
        height='100%'
        className={cn({ 'cursor-default pointer-events-none': search })}
      >
        {/* <NavigationControl style={{ top: 30, right: 30 }} showCompass={false} /> */}
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
              <SubmissionPanel submission={selected} />
            </Popup>
          )}
        </>
      </ReactMapGL>
    </>
  )
}
