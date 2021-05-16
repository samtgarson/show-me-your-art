/* eslint-disable react-hooks/rules-of-hooks */
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import config from 'next/config'
import { useMemo } from 'react'
import {
  Coordinates,
  SubmissionAttrs,
  SubmissionWithMeta
} from '~/types/entities'
import { hydrate } from '../util/hydrate'
import { v4 as uuid } from 'uuid'

const {
  publicRuntimeConfig: { supabaseUrl, supabaseAnonKey }
} = config()

export class DataClient {
  static useClient (): DataClient {
    return useMemo(() => DataClient.withCredentials(), [])
  }

  static withCredentials (): DataClient {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    return new DataClient(client)
  }

  constructor (private client: SupabaseClient) {}

  async getSubmissions (): Promise<SubmissionWithMeta[]> {
    const { data } = await this.client
      .from<SubmissionWithMeta>('submissions_with_meta')
      .select('*')

    return hydrate(data) || []
  }

  async getNearbySubmissions (
    coordinates: Coordinates
  ): Promise<SubmissionWithMeta[]> {
    const { data } = await this.client.rpc<SubmissionWithMeta>(
      'get_nearby_submissions',
      coordinates
    )

    return hydrate(data) || []
  }

  async imageUrl ({
    artist,
    image_id
  }: Pick<SubmissionWithMeta, 'image_id' | 'artist'>): Promise<string> {
    const { signedURL, error } = await this.client.storage
      .from('submissions')
      .createSignedUrl(`${artist}/${image_id}`, 60)

    if (error || !signedURL) throw error ?? new Error('Something went wrong')
    return signedURL
  }

  async uploadImage (artist: string, file: File): Promise<string> {
    const extension = this.extensionFor(file.type)
    const id = `${uuid()}.${extension}`
    const path = `${artist}/${id}`
    const { error } = await this.client.storage
      .from('submissions')
      .upload(path, file, { cacheControl: 'public, max-age=604800, immutable' })

    if (error) throw error
    return id
  }

  async createSubmission (attrs: SubmissionAttrs): Promise<void> {
    const { error } = await this.client.rpc('create_submission', attrs)

    if (error) throw error
  }

  private extensionFor (type: string) {
    switch (type) {
      case 'image/png':
        return 'png'
      case 'image/jpeg':
        return 'jpeg'
      default:
        throw new Error('Unsupported file type')
    }
  }
}
