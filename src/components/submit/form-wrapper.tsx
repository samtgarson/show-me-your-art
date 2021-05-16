import { motion } from 'framer-motion'
import React, { FC, useCallback, useState } from 'react'
import { Form } from 'react-final-form'
import { Button, Input } from '~/src/components/form/input'
import { DataClient } from '~/src/services/data-client'
import { LocationSearchResult } from '~/src/services/mapbox-client'
import { fileSize } from '~/src/util/file-size'
import { FileInput } from '../form/file-input'
import { LocationInput } from '../form/location-input'
import { modalVariants } from '../modal'

type SubmitFormProps = { artist: string, done(): void }
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

const process = async (
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
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (values: SubmitFormSchema) => {
      setLoading(true)
      try {
        await process(client, values, artist)
        done()
      } catch (_) {
        setLoading(false)
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
          className='flex flex-col h-full'
        >
          <h2 className='font-bold mb-6 text-xl'>Submit your {artist}</h2>
          <p className='mb-8'>
            Please upload a photo of the framed art and show the world where
            your art is. Your email will not be published, we will use it in
            case we need to get in touch.
          </p>
          <Input
            name='name'
            label='Name'
            placeholder='e.g. Samantha G. or Jonathan & Bobby'
          />
          <Input
            name='email'
            label='Email'
            type='email'
            placeholder='sam.g@email.com'
          />
          <Input name='image' component={FileInput} label='Photo' />
          <Input
            name='location'
            component={LocationInput}
            label='Location'
            placeholder='e.g. Brooklyn, New York'
          />
          <Button disabled={!valid} loading={loading}>
            Submit
          </Button>
          <p className='text-xs opacity-50 pt-16 mt-auto leading-5'>
            By submitting this information, you are giving us consent to utilise
            it for the sole purpose of this project. We will never share/sell
            your data. We also want to protect your privacy, so we will only
            accept an area or neighborhood name as a location—never your
            address.
          </p>
        </motion.form>
      )}
    />
  )
}
