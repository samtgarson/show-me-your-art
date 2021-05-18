/* eslint-disable promise/prefer-await-to-callbacks */
import { Map } from 'mapbox-gl'
import { RefObject } from 'react'
import {
  FlyToInterpolator,
  LayerProps,
  MapRef,
  ViewportProps
} from 'react-map-gl'
import { Coordinates, Submissions, SubmissionWithMeta } from '~/types/entities'

export const toGeoJson = (
  subs: Submissions
): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
  type: 'FeatureCollection',
  features: Object.values(subs).map(sub => ({
    type: 'Feature',
    id: sub.id,
    geometry: {
      coordinates: [sub.coordinates.longitude, sub.coordinates.latitude],
      type: 'Point'
    },
    properties: sub
  }))
})

export const layerStyles: LayerProps[] = [
  {
    id: 'point-unclustered',
    type: 'circle',
    source: 'submissions',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 1,
      'circle-opacity': 0
    }
  },
  {
    id: 'point-clustered',
    type: 'circle',
    source: 'submissions',
    filter: ['has', 'point_count'],
    paint: {
      'circle-radius': 1,
      'circle-opacity': 0
    }
  }
]

export const mapTransition = (d = 3000): Partial<ViewportProps> => ({
  transitionDuration: d,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: x => 1 - Math.pow(1 - x, 5)
})

export const getPopupLocation = (
  mapRef: RefObject<MapRef>,
  selected: SubmissionWithMeta | undefined,
  popupRef: RefObject<HTMLDivElement>
): Coordinates | void => {
  if (!selected || !mapRef.current) return
  const map: Map = mapRef.current.getMap()
  const point = map.project([
    selected.coordinates.longitude,
    selected.coordinates.latitude
  ])
  const { lng: centerLng } = map.getCenter()
  const { current: popup } = popupRef
  const leftOrRight = centerLng < selected.coordinates.longitude ? -1 : 1
  const offset = popup ? popup.offsetWidth / 2 : window.innerWidth / 4
  point.x += offset * leftOrRight
  const { lng: longitude, lat: latitude } = map.unproject(point)
  return { longitude, latitude }
}
