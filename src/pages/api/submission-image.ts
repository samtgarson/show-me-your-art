import axios from "axios"
import { NextApiHandler } from "next"
import { DataClient } from "~/src/services/data-client"

const handler: NextApiHandler = async (req, res) => {
  const { image_id, artist } = req.query as { image_id?: string, artist?: string }
  if (!image_id || !artist) return res.status(400).end()

  const client = DataClient.withCredentials()
  const url = await client.imageUrl({ image_id, artist })

  res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
  const imageRes = await axios({ method: 'get', url, responseType: 'stream' })
  imageRes.data.pipe(res)
}

export default handler
