import 'mapbox-gl/dist/mapbox-gl.css'
import config from 'next/config'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from "react"
import ReactMapGL, { FlyToInterpolator, Layer, MapRef, NavigationControl, Source, ViewportProps } from 'react-map-gl'
import { Coordinates, Submissions } from '~/types/data'
import { StateContext } from "../pages/_app"
import { layerStyles, toGeoJson } from '../util/map-data'

const { publicRuntimeConfig: { mapboxApiToken } } = config()

type MapProps = {
  data: Submissions
  fetchData (c: Coordinates): void
}

const START_COORDS = { latitude: 51.515579, longitude: -0.128360 }

export const Map: FC<MapProps> = ({ fetchData, data }) => {
  const [viewport, setViewport] = useState<ViewportProps>({
    ...START_COORDS,
    zoom: 8
  })
  const mapRef = useRef<MapRef>(null)

  const { start } = useContext(StateContext)
  useEffect(() => {
    if (start) setViewport({
      ...viewport,
      zoom: 10,
      pitch: 30,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: x => 1 - Math.pow(1 - x, 5)
    })
    else fetchData(START_COORDS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  const json = useMemo(() => data && toGeoJson(data), [data])

  return <div className="absolute h-screen w-screen left-0 top-0">
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      mapboxApiAccessToken={mapboxApiToken}
      onViewportChange={(nextViewport: ViewportProps) => { setViewport(nextViewport) }}
      width="100%"
      height="100%"
    >
      <NavigationControl style={{ top: 30, right: 30 }} showCompass={false} />
      <Source cluster={true} clusterProperties={{}} id='submissions' type='geojson' data={json}>
        { layerStyles.map(layerStyle => <Layer key={layerStyle.id} {...layerStyle} />) }
      </Source>
    </ReactMapGL>
  </div>
}
