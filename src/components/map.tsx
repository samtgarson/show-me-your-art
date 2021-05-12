import type { Point } from 'geojson'
import { GeoJSONSource, Map as IMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import config from 'next/config'
import React, {
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react'
import ReactMapGL, {
  Layer,
  MapRef,
  Popup,
  Source,
  ViewportProps
} from 'react-map-gl'
import { SubmissionWithMeta } from '~/types/data'
import { StateContext } from '../services/state'
import styles from '../styles/components/map.module.scss'
import { layerStyles, mapTransition, toGeoJson } from '../util/map-data'
import { MarkerClickEvent, SubmissionMarker } from './submission-marker'
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
  const mapRef = useRef<MapRef>(null)
  const [markers, setMarkers] = useState<(JSX.Element | undefined)[]>([])

  const [selected, setSelected] = useState<SubmissionWithMeta>()

  const zoomToCluster = useCallback(
    (id: number, geom: Point) => {
      if (!mapRef.current) return
      const map: IMap = mapRef.current.getMap()
      const source = map.getSource('submissions') as GeoJSONSource
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      source.getClusterExpansionZoom(id, (err, zoom) => {
        if (err || !zoom) return
        const [lng, lat] = geom.coordinates
        setViewport({
          ...viewport,
          zoom: zoom + 0.5,
          latitude: lat,
          longitude: lng,
          ...mapTransition()
        })
      })
    },
    [setViewport, viewport]
  )

  const onClick = useCallback(
    (evt: MarkerClickEvent) => {
      if (evt.cluster) zoomToCluster(evt.clusterId, evt.geom)
      else if (selected?.id === evt.sub.id) setSelected(undefined)
      else setSelected(evt.sub)
    },
    [selected?.id, zoomToCluster]
  )

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return []
    const map: IMap = mapRef.current.getMap()
    const bounds = map.getBounds()
    const dict: Record<string, boolean> = {}

    const markerArray = map.querySourceFeatures('submissions').map(feature => {
      const geom = feature.geometry as Point
      const id = feature.properties?.cluster
        ? feature.id
        : feature.properties?.id
      if (dict[id]) return
      dict[id] = true
      if (!bounds.contains([geom.coordinates[0], geom.coordinates[1]])) return

      return (
        <SubmissionMarker
          {...{ id, feature, geom, onClick, artist }}
          key={id}
          selectedSubmission={selected}
        />
      )
    })

    setMarkers(markerArray)
  }, [artist, onClick, selected])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers, viewport])

  return (
    <>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapboxApiAccessToken={mapboxApiToken}
        onViewportChange={(nextViewport: ViewportProps) => {
          setViewport(nextViewport)
        }}
        onClick={_ => setSelected(undefined)}
        width='100%'
        height='100%'
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
        {search || (
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
        )}
      </ReactMapGL>
    </>
  )
}
