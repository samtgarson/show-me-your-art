import React, { CSSProperties, FC, Fragment } from 'react'
import styles from '~/src/styles/components/marquee.module.scss'
import cn from 'classnames/bind'

type MarqueeProps = {
  duration?: number
  className?: string
  reverse?: boolean
  offset?: number
}

export const Marquee: FC<MarqueeProps> = ({
  children,
  duration = 30,
  className,
  reverse = false,
  offset = 5
}) => {
  return (
    <div
      style={
        {
          '--duration': `${duration}s`,
          '--offset': `${offset}%`
        } as CSSProperties
      }
      className={cn(
        styles.marquee,
        className,
        'w-full relative overflow-x-hidden'
      )}
    >
      <div
        className={cn(styles.inner)}
        style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <Fragment key={1}>{children}</Fragment>
        <Fragment key={2}>{children}</Fragment>
      </div>
    </div>
  )
}
