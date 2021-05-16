import cn from 'classnames'
import React, { FC } from 'react'
import { Field } from 'react-final-form'
import { TextInput } from './text-input'

type InputProps = Parameters<typeof Field>[0] & { label: string }
export const Input: FC<InputProps> = ({
  name,
  component = TextInput,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-white bg-opacity-10 mb-2 h-20 flex items-center px-8 flex-shrink-0'
      )}
    >
      <Field {...props} name={name} component={component} />
    </div>
  )
}

export const Label: FC<{ focus?: boolean, name: string }> = ({
  children,
  focus = false,
  name
}) => {
  return (
    <label
      htmlFor={name}
      className={cn(
        'absolute left-8 right-8 transition-all transform text-left',
        {
          'text-xs opacity-50 -translate-y-4': focus
        }
      )}
    >
      {children}
    </label>
  )
}

export const Button: FC<{ disabled?: boolean, loading?: boolean }> = ({
  disabled = false,
  loading = false,
  children
}) => (
  <button
    disabled={disabled || loading}
    className={cn(
      'h-20 px-8 w-full flex justify-between items-center uppercase font-bold flex-shrink-0 transition',
      {
        'opacity-25 cursor-default': disabled,
        'bg-white text-black': !disabled,
        'cursor-default': loading
      }
    )}
  >
    {children}
    {loading && (
      <span className='rounded-full border-t border-r border-b border-black border-l border-l-white animate-spin w-4 h-4 block' />
    )}
  </button>
)
