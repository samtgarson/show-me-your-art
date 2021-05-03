export type Coordinates = {
  latitude: number
  longitude: number
}

export type Print = 'mela' | 'pera'

export type Submission = {
  id: string
  print: Print
  geography: string
  created_at: Date
}

export type SubmissionWithMeta = Submission & {
  coordinates: Coordinates
}

export type Submissions = Record<string, SubmissionWithMeta>
