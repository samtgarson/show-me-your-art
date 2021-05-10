export type Coordinates = {
  latitude: number
  longitude: number
}

export type Submission = {
  id: string
  print: string
  artist: string
  geography: string
  created_at: Date
  image_id: string
  width: number
  height: number
}

export type SubmissionWithMeta = Submission & {
  coordinates: Coordinates
}

export type Submissions = Record<string, SubmissionWithMeta>
