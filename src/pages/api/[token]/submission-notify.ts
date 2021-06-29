import { NextApiHandler } from 'next'
import { EmailClient } from '~/src/services/email-client'

const { API_SECRET } = process.env
if (!API_SECRET) throw new Error('Missing env')

const email = new EmailClient()

const handler: NextApiHandler = async (req, res) => {
  if (req.query.token !== API_SECRET) return res.status(401).end()

  const { id, image_id: imageId, name, location, artist } = req.body
  await email.newSubmission({ imageId, name, location, artist, id })

  res.status(201).end()
}

export default handler
