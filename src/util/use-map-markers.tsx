import type { Point } from 'geojson'
import { GeoJSONSource, Map } from 'mapbox-gl'
import React, { useCallback, useEffect, useState } from 'react'
import { MapRef, ViewportProps } from 'react-map-gl'
import {
  MarkerClickEvent,
  SubmissionMarker
} from 'src/components/map/submission-marker'
import { SubmissionWithMeta } from '~/types/entities'
import { mapTransition } from './map-data'

type UseMarkersProps = {
  viewport: ViewportProps
  setViewport(viewport: ViewportProps): void
  artist: string
  hidden: boolean
  mapRef: MapRef | null
  selected?: SubmissionWithMeta
  setSelected(id?: string): void
}

// TODO: Refactor this file
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useMarkers = ({
  viewport,
  setViewport,
  artist,
  hidden,
  mapRef,
  selected,
  setSelected
}: UseMarkersProps) => {
  const [markers, setMarkers] = useState<(JSX.Element | undefined)[]>([])

  const zoomToCluster = useCallback(
    (id: number, geom: Point) => {
      if (!mapRef) return
      setSelected(undefined)
      const map: Map = mapRef.getMap()
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
    [mapRef, setSelected, setViewport, viewport]
  )

  const onClick = useCallback(
    (evt: MarkerClickEvent) => {
      if (evt.cluster) zoomToCluster(evt.clusterId, evt.geom)
      else if (selected?.id === evt.sub.id) setSelected(undefined)
      else setSelected(evt.sub.id)
    },
    [selected?.id, setSelected, zoomToCluster]
  )

  const updateMarkers = useCallback(() => {
    if (!mapRef) return []
    const map: Map = mapRef.getMap()
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
          hidden={hidden}
        />
      )
    })

    setMarkers(markerArray)
  }, [mapRef, onClick, artist, selected, hidden])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers, viewport])

  return { markers, mapRef }
}
