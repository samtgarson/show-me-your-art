import { GeoJSONSource, Map } from 'mapbox-gl'
import type { Point } from 'geojson'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { MapRef, ViewportProps } from 'react-map-gl'
import { SubmissionWithMeta } from '~/types/data'
import {
  MarkerClickEvent,
  SubmissionMarker
} from '../components/submission-marker'
import { mapTransition } from './map-data'

type UseMarkersProps = {
  viewport: ViewportProps
  setViewport(viewport: ViewportProps): void
  artist: string
}

// TODO: Refactor this file
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMarkers = ({
  viewport,
  setViewport,
  artist
}: UseMarkersProps) => {
  const mapRef = useRef<MapRef>(null)
  const [markers, setMarkers] = useState<(JSX.Element | undefined)[]>([])
  const [selected, setSelected] = useState<SubmissionWithMeta>()

  const zoomToCluster = useCallback(
    (id: number, geom: Point) => {
      if (!mapRef.current) return
      const map: Map = mapRef.current.getMap()
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
    const map: Map = mapRef.current.getMap()
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

  return { markers, selected, setSelected, mapRef }
}
