import { createClient, SupabaseClient } from "@supabase/supabase-js"
import config from "next/config"
import { Coordinates, SubmissionWithMeta } from "~/types/data"
import { hydrate } from "../util/hydrate"

const { publicRuntimeConfig: { supabaseUrl, supabaseAnonKey } } = config()

export class DataClient {
  static useClient (): DataClient {
    const client = createClient(supabaseUrl, supabaseAnonKey)

    return new DataClient(client)
  }

  constructor (
    private client: SupabaseClient
  ) {}

  async getSubmissions (coordinates: Coordinates): Promise<SubmissionWithMeta[]> {
    const { data } = await this.client
      .rpc<SubmissionWithMeta>('get_nearby_submissions', coordinates)

    return hydrate(data) || []
  }
}
