import { createClient } from '@supabase/supabase-js'
import { NextApiHandler } from 'next'
import { DataClient } from '~/src/services/data-client'
const { API_SECRET, BASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_URL } = process.env
if (!API_SECRET || !BASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_KEY)
  throw new Error('Missing env')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const data = new DataClient(supabase)

const handler: NextApiHandler = async (req, res) => {
  if (req.query.token !== API_SECRET) return res.status(401).end()
  const id = req.query.id as string

  const submission = await data.getSubmission(id)
  if (!submission) return res.end()

  await data.approveSubmission(id)

  res.redirect(301, `${BASE_URL}/${submission.artist}/submission/${id}`)
}

export default handler
