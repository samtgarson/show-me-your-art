import cn from 'classnames/bind'
import React, { CSSProperties, FC, Fragment } from 'react'

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
  offset = 0
}) => {
  return (
    <div
      style={
        {
          '--duration': `${duration}s`,
          '--offset': `${offset}%`,
          '--move-initial': 'calc(0% - var(--offset))',
          '--move-final': 'calc(-33.3% - var(--offset))'
        } as CSSProperties
      }
      className={cn(className, 'w-screen relative overflow-hidden py-[1vh]')}
    >
      <div
        className={cn('flex items-center relative w-[fit-content]')}
        style={{
          transform: 'translate3d(var(--move-initial), 0, 0)',
          animation: 'marquee var(--duration, 30s) linear infinite',
          animationDirection: reverse ? 'reverse' : 'normal'
        }}
      >
        <Fragment key={1}>{children}</Fragment>
        <Fragment key={2}>{children}</Fragment>
        <Fragment key={3}>{children}</Fragment>
      </div>
    </div>
  )
}
