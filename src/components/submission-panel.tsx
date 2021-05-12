import cn from 'classnames'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { SubmissionWithMeta } from '~/types/data'

type SubmissionPanelProps = {
  submission: SubmissionWithMeta
}

export const submissionImageSrc = (submission: SubmissionWithMeta): string =>
  `/api/submission-image?artist=${submission.artist}&image_id=${submission.image_id}`

export const SubmissionPanel: FC<SubmissionPanelProps> = ({ submission }) => {
  const [loaded, setLoaded] = useState(false)
  const src = useMemo(() => submissionImageSrc(submission), [submission])

  useEffect(() => {
    setLoaded(false)
  }, [src])

  return (
    <article key={submission.id} className="p-8 animate-fade-in bg-white">
      <div
        style={{
          width: `${submission.width}px`,
          height: `${submission.height}px`
        }}
        className="relative bg-grey"
      >
        {src && (
          <img
            src={src}
            onLoad={() => setTimeout(() => setLoaded(true), 0)}
            width={submission.width}
            height={submission.height}
            className={cn('transition-opacity duration-300 absolute', {
              'opacity-0': !loaded
            })}
          />
        )}
      </div>
      <p className="px-5 py-8 flex">
        <strong className="mr-auto">{submission.name}</strong>
        <span>Location</span>
      </p>
    </article>
  )
}
