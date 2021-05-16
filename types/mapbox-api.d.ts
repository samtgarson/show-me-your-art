import type { Feature, Point } from 'geojson'

export type GeolocationResult = Feature<Point> & {
  context: GeolocationContext[]
  text: string
}

export type GeolocationContext = { id: string, text: string }

export type GeolocationResponse = {
  query: string
  features: GeolocationResult[]
}
