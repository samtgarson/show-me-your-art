/* eslint-disable react-hooks/rules-of-hooks */
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import config from "next/config"
import { useMemo } from "react"
import { Coordinates, Submission, SubmissionWithMeta } from "~/types/data"
import { hydrate } from "../util/hydrate"

const { publicRuntimeConfig: { supabaseUrl, supabaseAnonKey } } = config()

export class DataClient {
  static useClient (): DataClient {
    return useMemo(() => DataClient.withCredentials(), [])
  }

  static withCredentials (): DataClient {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    return new DataClient(client)
  }

  constructor (
    private client: SupabaseClient
  ) {}

  async getSubmissions (): Promise<SubmissionWithMeta[]> {
    const { data } = await this.client
      .from<SubmissionWithMeta>('submissions_with_meta')
      .select('*')

    return hydrate(data) || []
  }

  async getNearbySubmissions (coordinates: Coordinates): Promise<SubmissionWithMeta[]> {
    const { data } = await this.client
      .rpc<SubmissionWithMeta>('get_nearby_submissions', coordinates)

    return hydrate(data) || []
  }

  async imageUrl (submission: Submission): Promise<string> {
    const { signedURL, error } = await this.client
      .storage
      .from('submissions')
      .createSignedUrl(`${submission.artist}/${submission.image_id}`, 60)

    if (error || !signedURL) throw error ?? new Error('Something went wrong')
    return signedURL
  }
}
