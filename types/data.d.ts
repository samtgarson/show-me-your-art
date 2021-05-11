export type Coordinates = {
  latitude: number
  longitude: number
}

export type Submission = {
  id: string
  artist: string
  geography: string
  created_at: Date
  image_id: string
  width: number
  height: number
  name: string
}

export type SubmissionWithMeta = Submission & {
  coordinates: Coordinates
}

export type Submissions = Record<string, SubmissionWithMeta>
