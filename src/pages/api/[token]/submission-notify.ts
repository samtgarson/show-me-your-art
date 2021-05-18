import { NextApiHandler } from 'next'
import { Telegram } from 'telegraf'
import { captionFor } from '~/src/util/telegram-helpers'

const { API_SECRET, TELEGRAM_API_KEY, TELEGRAM_CHAT_ID, BASE_URL } = process.env
if (!API_SECRET || !TELEGRAM_CHAT_ID || !TELEGRAM_API_KEY || !BASE_URL)
  throw new Error('Missing env')

const telegram = new Telegram(TELEGRAM_API_KEY)

const handler: NextApiHandler = async (req, res) => {
  if (req.query.token !== API_SECRET) return res.status(401).end()

  const { id, image_id: imageId, name, location, artist } = req.body
  const url = `${BASE_URL}/api/submission-image?artist=${artist}&image_id=${imageId}`

  await telegram.sendPhoto(
    TELEGRAM_CHAT_ID,
    { url },
    {
      parse_mode: 'MarkdownV2',
      ...captionFor(id, name, artist, location)
    }
  )

  res.status(201).end()
}

export default handler
