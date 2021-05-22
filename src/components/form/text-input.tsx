import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'
import React, { FC, useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Tooltip } from '../tooltip'
import { Label } from './input'

export const TextInput: FC<FieldRenderProps<string>> = ({
  input: { onChange, value, type, onBlur, onFocus, name },
  meta: { dirty, error },
  label,
  ...inputProps
}) => {
  const [focus, setFocus] = useState(false)

  return (
    <>
      <AnimatePresence>
        {inputProps.tooltip && focus && <Tooltip>{inputProps.tooltip}</Tooltip>}
      </AnimatePresence>
      <input
        className={cn(
          'w-full bg-transparent transition-translate transform placeholder-white outline-none',
          {
            'text-right placeholder-opacity-50': !focus && !value.length,
            'text-left text-left translate-y-1 placeholder-opacity-0':
              focus || value.length
          }
        )}
        {...inputProps}
        id={name}
        onFocus={e => {
          setFocus(true)
          onFocus(e)
        }}
        onBlur={e => {
          setFocus(false)
          onBlur(e)
        }}
        onChange={e => onChange(e.target.value)}
        type={type}
        value={value}
      />
      <Label name={name} focus={focus || !!value.length}>
        {label}
      </Label>
      {dirty && error && (
        <span className='absolute text-right right-6'>{error}</span>
      )}
    </>
  )
}
