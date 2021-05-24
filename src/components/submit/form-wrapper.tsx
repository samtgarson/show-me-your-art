import { motion } from 'framer-motion'
import React, { FC, useCallback, useState } from 'react'
import { Form } from 'react-final-form'
import { Artist } from '~/src/artists'
import { Button, Input } from '~/src/components/form/input'
import { DataClient } from '~/src/services/data-client'
import { LocationSearchResult } from '~/src/services/mapbox-client'
import { fileSize } from '~/src/util/file-size'
import { FileInput } from '../form/file-input'
import { LocationInput } from '../form/location-input'
import { modalVariants } from '../modal'

type SubmitFormProps = { artist: Artist, done(): void }
type SubmitFormSchema = {
  name: string
  email: string
  image: File
  location: LocationSearchResult
}

const validate = (values: SubmitFormSchema) => {
  const keys: Array<keyof SubmitFormSchema> = [
    'name',
    'email',
    'image',
    'location'
  ]
  const errors = keys.reduce((hsh, key) => {
    if (!values[key]) hsh[key] = 'Required'
    return hsh
  }, {} as Record<keyof SubmitFormSchema, string>)

  if (!errors.image && !['image/png', 'image/jpeg'].includes(values.image.type))
    errors.image = 'Must be a PNG or a JPEG'

  return errors
}

const processForm = async (
  client: DataClient,
  values: SubmitFormSchema,
  artist: string
) => {
  const { width, height } = await fileSize(values.image)
  const imageId = await client.uploadImage(artist, values.image)
  await client.createSubmission({
    artist,
    width,
    height,
    name: values.name,
    location: `${values.location.location}, ${values.location.area}`,
    image_id: imageId,
    ...values.location.coordinates
  })
}

export const SubmitForm: FC<SubmitFormProps> = ({ artist, done }) => {
  const client = DataClient.useClient()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (values: SubmitFormSchema) => {
      setError(false)
      setLoading(true)
      try {
        await processForm(client, values, artist.id)
        done()
      } catch (_) {
        setLoading(false)
        setError(true)
      }
    },
    [artist, client, done]
  )

  return (
    <Form<SubmitFormSchema>
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, valid }) => (
        <motion.form
          layout
          variants={modalVariants.wrapper}
          transition={{ ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className='flex flex-col'
        >
          <h2 className='mb-6 text-xl font-bold'>Submit your {artist.name}</h2>
          <p className='mb-8'>
            Upload a photo of the framed art and show the world where your art
            is.
          </p>
          <Input
            name='name'
            label='Name'
            placeholder='e.g. Samantha G. or John & Bobby'
          />
          <Input
            name='email'
            label='Email'
            type='email'
            placeholder='Your email will not be shared publicly'
          />
          <Input name='image' component={FileInput} label='Photo' />
          <Input
            name='location'
            component={LocationInput}
            label='Location'
            placeholder='e.g. Brooklyn, New York'
          />
          {error && (
            <p className='flex items-center h-20 px-10 mb-2 -mx-10 text-error bg-errorDark'>
              Something went wrong. Please try again or{' '}
              <a className='ml-3 underline' href='mailto:hello@showmeyour.art'>
                let us know!
              </a>
            </p>
          )}
          <Button disabled={!valid} loading={loading}>
            Submit
          </Button>
          <p className='pt-16 mt-auto text-xs opacity-50 leading-5'>
            By tapping “Submit”, you are giving us permission to store and use
            this information for the sole purpose of this project. We will never
            share or sell your data.
          </p>
        </motion.form>
      )}
    />
  )
}
