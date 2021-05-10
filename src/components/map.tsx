import { Map as IMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import config from 'next/config'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from "react"
import ReactMapGL, { FlyToInterpolator, Layer, MapEvent, MapRef, Popup, Source, ViewportProps } from 'react-map-gl'
import { State } from 'react-map-gl/src/components/interactive-map'
import { SubmissionWithMeta } from '~/types/data'
import { StateContext } from '../services/state'
import styles from '../styles/components/map.module.scss'
import { layerStyles, toGeoJson } from '../util/map-data'
import { SubmissionPanel } from './submission-panel'

const { publicRuntimeConfig: { mapboxApiToken } } = config()

type MapProps = {
}

const START_COORDS = { latitude: 51.515579, longitude: -0.128360 }

function getCursor ({ isHovering, isDragging }: State) {
  return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
}

export const Map: FC<MapProps> = () => {
  const { start, data } = useContext(StateContext)
  const json = useMemo(() => data && toGeoJson(data), [data])
  const mapRef = useRef<MapRef>(null)

  const [selected, setSelected] = useState<SubmissionWithMeta>()
  const [viewport, setViewport] = useState<ViewportProps>({
    ...START_COORDS,
    zoom: 8
  })

  useEffect(() => {
    if (start) setViewport({
      ...viewport,
      zoom: 10,
      pitch: 30,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: x => 1 - Math.pow(1 - x, 5)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  const onClick = ({ features }: MapEvent) => {
    if (!mapRef.current) return

    const map: IMap = mapRef.current.getMap()
    if (!features || !features[0]) {
      if (selected) {
        map.removeFeatureState({ source: 'submissions', id: selected.id })
        setSelected(undefined)
      }
      return
    }
    const submission = data[features[0].properties.id]
    const alreadyActive = selected === submission
    setSelected(alreadyActive ? undefined : submission)
  }

  return <div className="absolute h-screen w-screen left-0 top-0">
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      mapboxApiAccessToken={mapboxApiToken}
      onViewportChange={(nextViewport: ViewportProps) => { setViewport(nextViewport) }}
      width="100%"
      height="100%"
      onClick={onClick}
      interactiveLayerIds={['point-unclustered']}
      getCursor={getCursor}
    >
      {/* <NavigationControl style={{ top: 30, right: 30 }} showCompass={false} /> */}
      <Source cluster={true} clusterProperties={{}} id='submissions' type='geojson' data={json}>
        { layerStyles.map(layerStyle => <Layer key={layerStyle.id} {...layerStyle} />) }
      </Source>
      { selected && <Popup
        longitude={selected.coordinates.longitude}
        latitude={selected.coordinates.latitude}
        onClose={setSelected}
        anchor='left'
        tipSize={0}
        className={styles.popup}
        closeButton={false}
      >
        <SubmissionPanel submission={selected} />
      </Popup> }
    </ReactMapGL>
  </div>
}
