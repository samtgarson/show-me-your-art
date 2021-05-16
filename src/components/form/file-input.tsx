import React, { ChangeEvent, FC, useRef } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Label } from './input'

export const FileInput: FC<FieldRenderProps<File>> = ({
  input: { onChange, value, name }
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const chooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    onChange((e.target.files || [])[0])
  }

  const clearInput = () => {
    onChange(undefined)
    if (ref.current) ref.current.value = ''
  }

  return (
    <>
      <input
        ref={ref}
        onChange={chooseFile}
        type='file'
        className='hidden'
        id={name}
        accept='.jpg,.jpeg,.png,image/*'
      />
      {value && (
        <span className='transform translate-y-1 w-full' onClick={clearInput}>
          {value.name}
          <img src='/icons/close.svg' className='float-right cursor-pointer' />
        </span>
      )}
      <Label focus={!!value} name={name}>
        Upload Image
        {!value && (
          <img src='/icons/upload.svg' className='float-right cursor-pointer' />
        )}
      </Label>
    </>
  )
}
