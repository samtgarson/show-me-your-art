import { createClient } from '@supabase/supabase-js'
import { NextApiHandler } from 'next'
import { Telegram } from 'telegraf'
import { CallbackQuery } from 'telegraf/typings/core/types/typegram'
import { DataClient } from '~/src/services/data-client'
import { captionFor, viewSubmissionButton } from '~/src/util/telegram-helpers'

const {
  API_SECRET,
  TELEGRAM_API_KEY,
  TELEGRAM_CHAT_ID,
  BASE_URL,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL
} = process.env
if (
  !API_SECRET ||
  !TELEGRAM_CHAT_ID ||
  !TELEGRAM_API_KEY ||
  !BASE_URL ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_KEY
)
  throw new Error('Missing env')

const telegram = new Telegram(TELEGRAM_API_KEY)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const data = new DataClient(supabase)

const handler: NextApiHandler = async (req, res) => {
  const {
    data: id,
    id: cbId,
    message
  } = req.body.callback_query as CallbackQuery.DataCallbackQuery
  const submission = await data.getSubmission(id)
  if (!submission || !message) return res.end()

  await data.approveSubmission(id)

  const { caption } = captionFor(
    id,
    submission.name,
    submission.artist,
    submission.location
  )
  const { reply_markup } = viewSubmissionButton(id, submission.artist)

  await telegram.editMessageCaption(
    TELEGRAM_CHAT_ID,
    message.message_id,
    undefined,
    `${caption}

✅ _Approved\\!_`,
    { parse_mode: 'MarkdownV2', reply_markup }
  )
  await telegram.answerCbQuery(cbId)

  res.status(200).end()
}

export default handler
