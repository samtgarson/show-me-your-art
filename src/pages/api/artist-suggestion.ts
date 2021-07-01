import rateLimit from 'micro-ratelimit'
import { NextApiHandler } from 'next'
import { SuggestArtistSchema } from '~/src/components/suggest-an-artist/modal'
import { EmailClient } from '~/src/services/email-client'

const emailClient = new EmailClient()

const handler: NextApiHandler = async (req, res) => {
  const { email, url, name } = req.body as Partial<SuggestArtistSchema>
  if (!email || !url || !name) return res.status(400).end()

  await emailClient.artistSuggestion({ email, url, name })
  res.status(201).end()
}

const limitedHandler: NextApiHandler = async (req, res) => {
  try {
    await rateLimit({ window: 5000, headers: true }, handler)(req, res)
  } catch (e) {
    res.status(e.statusCode ?? 500).send({ error: e.message })
  }
}

export default limitedHandler
