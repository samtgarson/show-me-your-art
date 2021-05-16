import { AnimatePresence, motion } from 'framer-motion'
import React, {
  FC,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useState
} from 'react'
import { FieldRenderProps } from 'react-final-form'
import {
  LocationSearchResult,
  MapboxClient
} from '~/src/services/mapbox-client'
import { Label } from './input'
import { TextInput } from './text-input'

const Location: FC<{ l: LocationSearchResult }> = ({ l }) => (
  <>
    {l.location}
    <span className='opacity-50'>, {l.area}</span>
  </>
)

export const LocationInput: FC<FieldRenderProps<LocationSearchResult>> = ({
  input: { onChange, value, name, onBlur, onFocus },
  meta: { dirty, error },
  label,
  placeholder
}) => {
  const [options, setOptions] = useState<LocationSearchResult[]>([])
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<number>(0)
  const client = MapboxClient.useClient()

  useEffect(() => {
    if (!search || search.length < 3) return setOptions([])

    setLoading(true)
    const fetch = async () => {
      const results = await client.searchLocations(search)
      setActive(0)
      setOptions(results)
      setLoading(false)
    }

    fetch()
  }, [client, search])

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.code) {
      case 'Enter':
        e.preventDefault()
        return onChange(options[active])
      case 'ArrowDown':
        e.preventDefault()
        return setActive((active + 1) % options.length)
      case 'ArrowUp':
        e.preventDefault()
        return setActive((options.length + active - 1) % options.length)
    }
  }

  const textInputMeta = {
    onBlur: (e?: FocusEvent<HTMLElement>) => {
      if (!value) setSearch('')
      setOptions([])
      onBlur(e)
    },
    onFocus,
    name,
    value: search ?? '',
    onChange: setSearch
  }

  if (value)
    return (
      <>
        <Label name={name} focus>
          {label}
        </Label>
        <span
          onClick={() => {
            setOptions([])
            setSearch('')
            onChange(undefined)
          }}
          className='w-full transform translate-y-1 cursor-pointer'
        >
          <Location l={value} />
          <img src='/icons/close.svg' className='float-right' />
        </span>
      </>
    )

  const variants = {
    ul: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    },
    li: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  }

  return (
    <>
      <TextInput
        label={label}
        placeholder={placeholder}
        meta={{ dirty, error }}
        input={textInputMeta}
        onKeyDown={handleKeyUp}
      />
      <AnimatePresence>
        {search.length > 2 && (
          <motion.ul
            layout
            variants={variants.ul}
            transition={{ ease: 'easeOut' }}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className='w-full absolute left-0 right-0 top-full py-4 bg-white text-black z-50 origin-top-left'
          >
            {loading && !options.length && (
              <li className='px-8 py-4 opacity-50'>Loading</li>
            )}
            {!loading && !options.length && search.length > 2 && (
              <li className='px-8 py-4'>No results</li>
            )}
            {options.map((opt, i) => (
              <motion.li
                layout
                variants={variants.li}
                key={opt.id}
                onMouseOver={() => setActive(i)}
                onMouseDown={e => e.preventDefault()}
                onClick={() => onChange(opt)}
                className='px-8 py-4 cursor-pointer relative'
              >
                <Location l={opt} />
                {active == i && (
                  <motion.span
                    layout
                    layoutId='selection'
                    className='absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-5'
                  />
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  )
}
