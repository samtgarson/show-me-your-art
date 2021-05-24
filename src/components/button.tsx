import Link from 'next/link'
import React, { AnchorHTMLAttributes, FC } from 'react'
import cn from 'classnames'

type BtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
  inverted?: boolean
}

export const Btn: FC<BtnProps> = ({
  href = '',
  children,
  className,
  inverted = false,
  ...props
}) => {
  const anchor = (
    <a
      {...props}
      className={cn(
        'px-4 py-2 font-bold border border-black uppercase cursor-pointer',
        { 'bg-black text-white': inverted },
        className
      )}
    >
      {children}
    </a>
  )

  if (!href) return anchor

  return <Link href={href}>{anchor}</Link>
}
