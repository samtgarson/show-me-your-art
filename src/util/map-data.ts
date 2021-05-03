/* eslint-disable promise/prefer-await-to-callbacks */
import { Map } from "mapbox-gl"
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
    type: 'symbol',
    source: 'submissions',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': [
        'coalesce',
        ['image', ['get', 'print']],
        'mela'
      ],
      'icon-size': [
        "interpolate", ["linear"], ["zoom"],
        0, 0.05,
        12, 0.5
      ]
    },
    paint: {}
  },
  {
    id: 'point-clustered',
    type: 'symbol',
    source: 'submissions',
    filter: ['has', 'point_count'],
    layout: {
      'icon-image': 'mela',
      'icon-size': [
        "interpolate", ["linear"], ["zoom"],
        0, 0.3,
        12, 0.5
      ],
      'text-field': '{point_count}',
      'text-font': [
        'Open Sans Bold',
        'Arial Unicode MS Bold'
      ],
      'text-size': 18
    },
    paint: {
      'text-color': '#ffffff'
    }
  }
]

export const loadImages = async (map: Map): Promise<void> => {
  const images = ['pera', 'mela']
  const promises = images.map(async img => new Promise((resolve, reject) => {
    map.loadImage(`/${img}.png`, (err, image) => {
      if (err) return reject(err)
      if (!map.hasImage(img)) map.addImage(img, image)
      resolve(null)
    })
  }))

  await Promise.all(promises)
}
