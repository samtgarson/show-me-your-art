import 'mapbox-gl/dist/mapbox-gl.css'
import config from 'next/config'
import React, { FC, useContext, useEffect, useState } from "react"
import ReactMapGL, { FlyToInterpolator, NavigationControl, ViewportProps } from 'react-map-gl'
import { StateContext } from "../pages/_app"

const { publicRuntimeConfig: { mapboxApiToken } } = config()

export const Map: FC = () => {
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 51.515579,
    longitude: -0.128360,
    zoom: 8
  })

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  return <div className="absolute h-screen w-screen left-0 top-0">
    <ReactMapGL
      mapboxApiAccessToken={mapboxApiToken}
      {...viewport}

      onViewportChange={(nextViewport: ViewportProps) => setViewport(nextViewport)}
      width="100%"
      height="100%"
    >
      <NavigationControl style={{ top: 30, right: 30 }} showCompass={false} />
    </ReactMapGL>
  </div>
}
