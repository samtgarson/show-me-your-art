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
  location: string
  state: 'pending' | 'approved'
}

export type SubmissionWithMeta = Submission & {
  coordinates: Coordinates
}

export type SubmissionAttrs = Omit<
  Submission,
  'geography' | 'created_at' | 'id'
> & {
  longitude: number
  latitude: number
}

export type Submissions = Record<string, SubmissionWithMeta>
