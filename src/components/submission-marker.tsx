import cn from 'classnames'
import type { Point } from 'geojson'
import { MapboxGeoJSONFeature } from "mapbox-gl"
import React, { FC, useCallback, useContext, useMemo } from "react"
import { Marker } from "react-map-gl"
import { SubmissionWithMeta } from "~/types/data"
import { StateContext } from "../services/state"

export type MarkerClickEvent =
  { cluster: true, clusterId: number, geom: Point }
  | { cluster: false, sub: SubmissionWithMeta }
type SubmissionMarkerProps = {
  feature: MapboxGeoJSONFeature
  selectedSubmission?: SubmissionWithMeta
  geom: Point
  id: string
  onClick(evt: MarkerClickEvent): void
  artist: string
}

export const SubmissionMarker: FC<SubmissionMarkerProps> = ({ feature, selectedSubmission, geom, id, onClick, artist }) => {
  const { data } = useContext(StateContext)
  const sub = data[feature.properties?.id]
  const cluster = feature.properties?.cluster
  const selected = selectedSubmission?.id == id
  const big = selected || cluster

  const clickHandler = useCallback(() => {
    if (cluster) onClick({ cluster: true, clusterId: parseInt(id, 10), geom })
    else onClick({ cluster: false, sub })
  }, [cluster, geom, id, onClick, sub])

  const classes = useMemo(() => cn(
    'transition-all flex items-center justify-center text-white cursor-pointer transform hover:scale-110',
    {
      '-ml-6 -mt-6 w-12 h-12': big,
      'w-5 h-5 -ml-2 -mt-2': !big,
      'font-thin text-3xl': selected,
      'font-bold text-xl': cluster
    }
  ), [big, cluster, selected])

  const content = useMemo(() => {
    if (cluster) return feature.properties?.point_count
    return '×'
  }, [cluster, feature])


  return <Marker key={id} latitude={geom.coordinates[1]} longitude={geom.coordinates[0]}>
    <span
      className={classes}
      style={{ backgroundColor: `var(--${artist})`, color: !big ? `var(--${artist})` : 'white' }}
      onClick={clickHandler}
    >{ content }</span>
  </Marker>
}

