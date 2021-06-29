import nodemailer from 'nodemailer'

const { SMTP_URL, BASE_URL, API_SECRET } = process.env
if (!SMTP_URL || !BASE_URL || !API_SECRET) throw new Error('Missing env')

type NewSubmissionPayload = {
  id: string
  imageId: string
  name: string
  location: string
  artist: string
}

const address = 'Show Me Your Art <hello@showmeyour.art>'

export class EmailClient {
  private client = nodemailer.createTransport(SMTP_URL)

  async newSubmission ({
    id,
    name,
    location,
    artist,
    imageId
  }: NewSubmissionPayload): Promise<void> {
    const path = `${BASE_URL}/api/submission-image?artist=${artist}&image_id=${imageId}`
    const html = `<p>
Name: <strong>${name}</strong><br />
Location: <strong>${location}</strong><br />
Artist: <strong>${artist}</strong><br />
</p>
<a href="${BASE_URL}/api/${API_SECRET}/submission-approve/${id}">✅ Approve Submission</a>
<img src="${path}" />
`

    await this.client.sendMail({
      from: address,
      to: address,
      subject: '🎉 New Submission',
      text: `New submission for ${artist}`,
      html
    })
  }
}
