declare module 'micro-ratelimit' {
  export type RateLimitOptions = {
    window?: number
    limit?: number
    keyGenerator?: (req: NextApiRequest) => string
    headers?: boolean
  }

  export default function (
    options: RateLimitOptions,
    handler: NextApiHandler
  ): NextApiHandler
  export default function (handler: NextApiHandler): NextApiHandler
}
