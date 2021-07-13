import type { Point } from 'geojson'
import { GeoJSONSource, Map } from 'mapbox-gl'
import React, { useCallback, useEffect, useState } from 'react'
import { MapRef, ViewportProps } from 'react-map-gl'
import {
  MarkerClickEvent,
  SubmissionMarker
} from 'src/components/map/submission-marker'
import { promisify } from 'util'
import { SubmissionWithMeta } from '~/types/entities'
import { Artist } from '../artists'
import { findSourceDupes } from './find-dupes'
import { mapTransition } from './map-data'

type UseMarkersProps = {
  viewport: ViewportProps
  setViewport(viewport: ViewportProps): void
  artist: Artist
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
  const zoomToCluster = useCallback(
    async (id: number, source: GeoJSONSource, geom: Point) => {
      const getZoom = promisify(source.getClusterExpansionZoom.bind(source))
      const zoom = await getZoom(id)
      const [lng, lat] = geom.coordinates
      setSelected(undefined)
      setViewport({
        ...viewport,
        zoom: zoom + 0.5,
        latitude: lat,
        longitude: lng,
        ...mapTransition()
      })
    },
    [setViewport, viewport, setSelected]
  )

  const handleClusterClick = useCallback(
    async (id: number, geom: Point) => {
      if (!mapRef) return
      const map: Map = mapRef.getMap()
      const source = map.getSource('submissions') as GeoJSONSource
      try {
        const dupes = await findSourceDupes(source, id)
        if (dupes.length === 1) return setSelected(dupes[0][0])
        await zoomToCluster(id, source, geom)
      } catch (e) {
        console.error(e)
      }
    },
    [mapRef, zoomToCluster, setSelected]
  )

  const onClick = useCallback(
    (evt: MarkerClickEvent) => {
      if (evt.cluster) handleClusterClick(evt.clusterId, evt.geom)
      else if (selected?.id === evt.sub.id) setSelected(undefined)
      else setSelected(evt.sub.id)
    },
    [selected?.id, setSelected, handleClusterClick]
  )

  const getMarkers = useCallback(() => {
    if (!mapRef) return []
    const map: Map = mapRef.getMap()
    const bounds = map.getBounds()
    const dict: Record<string, boolean> = {}

    return map.querySourceFeatures('submissions').map((feature, i) => {
      const geom = feature.geometry as Point
      const id = feature.properties?.cluster
        ? feature.id
        : feature.properties?.id
      if (dict[id]) return
      dict[id] = true
      if (!bounds.contains([geom.coordinates[0], geom.coordinates[1]])) return

      return (
        <SubmissionMarker
          {...{ id, feature, geom, onClick, i, artist }}
          key={id}
          selectedSubmission={selected}
          hidden={hidden}
        />
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, onClick, artist, selected, hidden, viewport])

  const [markers, setMarkers] = useState<(JSX.Element | undefined)[]>(
    getMarkers()
  )

  useEffect(() => {
    const markerArray = getMarkers()
    setMarkers(markerArray)
  }, [getMarkers, viewport])

  return { markers, mapRef }
}
