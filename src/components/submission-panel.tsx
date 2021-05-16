import cn from 'classnames'
import React, {
  CSSProperties,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { SubmissionWithMeta } from '~/types/entities'

type SubmissionPanelProps = {
  submission: SubmissionWithMeta
  className?: string
  style?: CSSProperties
}

export const submissionImageSrc = (submission: SubmissionWithMeta): string =>
  `/api/submission-image?artist=${submission.artist}&image_id=${submission.image_id}`

export const SubmissionPanel: FC<SubmissionPanelProps> = ({
  submission,
  className,
  style
}) => {
  const [loaded, setLoaded] = useState(false)
  const src = useMemo(() => submissionImageSrc(submission), [submission])
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setLoaded(false)
  }, [src])

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <article
      key={submission.id}
      className={cn('animate-fade-in bg-white', className)}
      style={style}
    >
      <div
        style={{
          paddingTop: `${(submission.height / submission.width) * 100}%`
        }}
        className='relative bg-grey'
      >
        {src && (
          <img
            ref={ref}
            onLoad={() => setTimeout(() => setLoaded(true), 0)}
            src={src}
            className={cn(
              'transition-opacity duration-300 absolute top-0 left-0 w-full h-full',
              {
                'opacity-0': !loaded
              }
            )}
          />
        )}
      </div>
      <p className='px-5 py-8 flex text-sm'>
        <strong className='mr-auto'>{submission.name}</strong>
        <span>{submission.location}</span>
      </p>
    </article>
  )
}
