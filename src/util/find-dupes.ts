import { GeoJSONSource } from 'mapbox-gl'
import { promisify } from 'util'
import { Submissions, SubmissionWithMeta } from '~/types/entities'

export const findSourceDupes = async (
  source: GeoJSONSource,
  clusterId: number
): Promise<string[][]> => {
  const getLeaves = promisify(source.getClusterLeaves.bind(source))
  const leaves = await getLeaves(clusterId, Number.POSITIVE_INFINITY, 0)

  const dupes = leaves.reduce((hsh, feature) => {
    if (feature.geometry.type !== 'Point' || typeof feature.id !== 'string')
      return hsh
    const coords = feature.geometry.coordinates.join('|')
    hsh[coords] = hsh[coords] || []
    hsh[coords].push(feature.id)
    return hsh
  }, {} as Record<string, string[]>)

  return Object.values(dupes)
}

export const findDataDupes = (
  data: Submissions,
  control: SubmissionWithMeta
): SubmissionWithMeta[] => {
  return Object.values(data).reduce<SubmissionWithMeta[]>((arr, sub) => {
    if (
      sub.coordinates.latitude === control.coordinates.latitude &&
      sub.coordinates.longitude === control.coordinates.longitude
    )
      arr.push(sub)
    return arr
  }, [])
}

export const sourceContains = async (
  source: GeoJSONSource,
  clusterId?: string,
  id?: string
): Promise<boolean> => {
  if (!clusterId || !id) return false
  const getLeaves = promisify(source.getClusterLeaves.bind(source))
  const leaves = await getLeaves(
    parseInt(clusterId),
    Number.POSITIVE_INFINITY,
    0
  )

  return leaves.some(feature => feature.id == id)
}
