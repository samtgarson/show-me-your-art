import {
  ExtraEditMessageCaption,
  ExtraPhoto
} from 'telegraf/typings/telegram-types'

export const captionFor = (
  id: string,
  name: string,
  artist: string,
  location: string
): ExtraPhoto => ({
  caption: `
*🎉 New Submission*

Name: *${name}*
Location: *${location}*
Artist: *${artist}*`,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Approve',
          callback_data: id
        }
      ]
    ]
  }
})

export const viewSubmissionButton = (
  id: string,
  artist: string
): ExtraEditMessageCaption => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'View submission',
          url: `${process.env.BASE_URL}/${artist}/submission/${id}`
        }
      ]
    ]
  }
})
