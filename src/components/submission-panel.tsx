import React, { FC, useEffect, useState } from "react"
import { SubmissionWithMeta } from "~/types/data"
import { DataClient } from "../services/data-client"
import cn from 'classnames'

type SubmissionPanelProps = {
  submission: SubmissionWithMeta
}

export const SubmissionPanel: FC<SubmissionPanelProps> = ({ submission }) => {
  const client = DataClient.useClient()
  const [src, setSrc] = useState<string>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSrc(undefined)
    setLoaded(false)

    const set = async () => { setSrc(await client.imageUrl(submission)) }
    set()
  }, [client, submission])

  return <article key={submission.id} className="p-8 animate-fade-in bg-white">
    <div style={{ width: `${submission.width}px`, height: `${submission.height}px` }} className="relative bg-grey">
      { src && <img
        src={src}
        onLoad={() => setTimeout(() => setLoaded(true), 100)}
        width={submission.width}
        height={submission.height}
        className={cn('transition-opacity duration-300 absolute', { 'opacity-0': !loaded })}
      /> }
    </div>
  </article>
}
