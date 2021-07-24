import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'
import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { SubmissionWithMeta } from '~/types/entities'

export type SubmissionPanelProps = {
  submissions: SubmissionWithMeta[]
  className?: string
  style?: CSSProperties
}

export const submissionImageSrc = (submission: SubmissionWithMeta): string =>
  `/api/submission-image?artist=${submission.artist}&image_id=${submission.image_id}`

const arrowClasses =
  'absolute top-1/2 bg-white w-12 h-12 flex items-center justify-center -mt-6'

// eslint-disable-next-line react/display-name
export const SubmissionPanel = forwardRef<HTMLElement, SubmissionPanelProps>(
  ({ submissions, className, style }, ref) => {
    const [loaded, setLoaded] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)
    const [index, setIndex] = useState(0)
    const submission = useMemo(() => submissions[index], [submissions, index])
    const src = useMemo(() => submissionImageSrc(submission), [submission])

    const next = () => {
      setIndex((index + 1) % submissions.length)
    }
    const prev = () => {
      setIndex((index + submissions.length - 1) % submissions.length)
    }

    useEffect(() => {
      setLoaded(false)
    }, [src])

    useEffect(() => {
      if (imageRef.current?.complete) setLoaded(true)
    }, [])

    if (!submissions.length) return null
    return (
      <article
        key={submissions[0].id}
        className={cn('animate-fade-in bg-white', className)}
        style={style}
        ref={ref}
      >
        <div
          style={{
            paddingTop: `${
              (submissions[0].height / submissions[0].width) * 100
            }%`
          }}
          className={cn('relative', { 'bg-grey': !loaded })}
        >
          <AnimatePresence>
            {src && (
              <img
                ref={imageRef}
                onLoad={() => setLoaded(true)}
                src={src}
                width={submission.width}
                height={submission.height}
                key={submission.id}
                className={cn(
                  'transition-opacity duration-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  {
                    'opacity-0': !loaded
                  }
                )}
              />
            )}
          </AnimatePresence>
        </div>
        <div className='px-5 py-8 flex text-xs items-center flex-wrap'>
          <strong className='mr-auto'>{submission.name}</strong>
          <span>{submission.location}</span>
          {submissions.length > 1 && (
            <div className='w-full flex mt-6 items-end'>
              {[...Array(submissions.length).keys()].map(i => (
                <span
                  key={i}
                  className={cn(
                    'flex-grow mx-2 first:ml-0 last:mr-0 transition-all h-[2px]',
                    {
                      'bg-gray-200': i !== index,
                      'bg-black': i === index
                    }
                  )}
                />
              ))}
            </div>
          )}
        </div>
        {submissions.length > 1 && (
          <>
            <button
              onClick={prev}
              type='button'
              className={cn(arrowClasses, 'left-0 transform rotate-180')}
            >
              <img src='/icons/chevron.svg' className='w-3' />
            </button>
            <button
              onClick={next}
              type='button'
              className={cn(arrowClasses, 'right-0')}
            >
              <img src='/icons/chevron.svg' className='w-3' />
            </button>
          </>
        )}
      </article>
    )
  }
)
