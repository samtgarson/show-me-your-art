import { NextApiHandler } from "next"

const handler: NextApiHandler = (req, res) => {
  const { src } = req.query
  if (!src) return res.status(400).end()
}
