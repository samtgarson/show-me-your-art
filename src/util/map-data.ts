/* eslint-disable promise/prefer-await-to-callbacks */
import { FlyToInterpolator, LayerProps, ViewportProps } from 'react-map-gl'
import { Submissions } from '~/types/entities'

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
