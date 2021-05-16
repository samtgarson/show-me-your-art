/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import config from 'next/config'
import { useMemo } from 'react'
import { Coordinates } from '~/types/entities'
import { GeolocationContext, GeolocationResponse } from '~/types/mapbox-api'

const {
  publicRuntimeConfig: { mapboxApiToken }
} = config()

export type LocationSearchResult = {
  coordinates: Coordinates
  location: string
  area: string
  id: string
}

const contextPrefixes = ['place', 'region', 'country']

export class MapboxClient {
  static useClient (): MapboxClient {
    return useMemo(() => MapboxClient.withCredentials(), [])
  }

  static withCredentials (): MapboxClient {
    return new MapboxClient(mapboxApiToken)
  }

  constructor (private token: string) {}
  private client = axios.create({
    params: { access_token: this.token },
    baseURL: 'https://api.mapbox.com'
  })

  async searchLocations (search: string): Promise<LocationSearchResult[]> {
    const response = await this.client.get<GeolocationResponse>(
      `/geocoding/v5/mapbox.places/${search}.json`,
      {
        params: {
          types: 'region,neighborhood,district,locality',
          fuzzyMatch: false
        }
      }
    )
    const { features } = response.data

    return features.map(
      ({
        geometry: {
          coordinates: [longitude, latitude]
        },
        context,
        text
      }) => {
        const area = this.areaFor(context)
        return {
          id: `${text}:${area}`,
          coordinates: { longitude, latitude },
          location: text,
          area
        }
      }
    )
  }

  private areaFor (context: GeolocationContext[]) {
    return context.reduceRight(
      (area, { id, text }) =>
        contextPrefixes.some(pre => id.startsWith(pre)) ? text : area,
      ''
    )
  }
}
