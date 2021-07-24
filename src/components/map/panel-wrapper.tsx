import React, { forwardRef, useContext, useMemo } from 'react'
import { SubmissionWithMeta } from '~/types/entities'
import { StateContext } from '../../services/state'
import { findDataDupes } from '../../util/find-dupes'
import { SubmissionPanel, SubmissionPanelProps } from '../submission-panel'

type PanelWrapperProps = { submission: SubmissionWithMeta } & Omit<
  SubmissionPanelProps,
  'submissions'
>

export const submissionImageSrc = (submission: SubmissionWithMeta): string =>
  `/api/submission-image?artist=${submission.artist}&image_id=${submission.image_id}`

// eslint-disable-next-line react/display-name
export const PanelWrapper = forwardRef<HTMLElement, PanelWrapperProps>(
  ({ submission, ...props }, ref) => {
    const { data } = useContext(StateContext)
    const subs = useMemo(
      () => findDataDupes(data, submission),
      [data, submission]
    )

    return (
      <SubmissionPanel
        submissions={subs}
        {...props}
        ref={ref}
        className='sm:p-4 w-[100vw] sm:w-[50vh] sm:max-w-[90vw]'
      />
    )
  }
)
