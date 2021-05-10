/* eslint-disable promise/prefer-await-to-callbacks */
import { LayerProps } from "react-map-gl"
import { Submissions } from "~/types/data"

export const toGeoJson = (subs: Submissions): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
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
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        // ['interpolate', ['linear'], ['zoom'], [
        //   0, 6,
        //   15, 10
        // ]],
        20,
        6
      ],
      'circle-color': [
        'match',
        ['get', 'print'],
        'mela', '#CC261E',
        'pera', '#09833A',
        'pantera', '#000',
        '#CC261E' // other
      ]
    }
  },
  {
    id: 'point-clustered',
    type: 'circle',
    source: 'submissions',
    filter: ['has', 'point_count'],
    paint: {
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [0, 10],
          [15, 20]
        ]
      },
      'circle-color': [
        'match',
        ['get', 'print'],
        'mela', '#CC261E',
        'pera', '#09833A',
        'pantera', '#000',
        '#CC261E' // other
      ]
    }
  },
  {
    id: 'point-clustered-labels',
    type: 'symbol',
    source: 'submissions',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count}',
      'text-font': [
        'Open Sans Bold',
        'Arial Unicode MS Bold'
      ],
      'text-size': 14
    },
    paint: {
      'text-color': '#ffffff'
    }
  }
]
