import axios from 'axios'
import { motion } from 'framer-motion'
import React, { FC, useState } from 'react'
import { Form } from 'react-final-form'
import { Button, Input } from '../form/input'
import { Modal, modalVariants } from '../modal'

export type SuggestArtistSchema = {
  name: string
  url: string
  email: string
}

const validate = (vals: SuggestArtistSchema) => {
  const errors = {} as Record<keyof SuggestArtistSchema, string>
  for (const key of ['name', 'url', 'email'] as Array<
    keyof SuggestArtistSchema
  >) {
    if (!vals[key] || vals[key].length == 0) errors[key] = 'Required'
  }
  console.log(errors)
  return errors
}

const wrapperAttrs = {
  variants: modalVariants.wrapper,
  layout: true,
  transition: { ease: 'easeOut' },
  className: 'flex flex-col'
}

export const SuggestArtistModal: FC<{
  bottom?: boolean
  onClose?: () => void
}> = ({ bottom, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (body: SuggestArtistSchema) => {
    setLoading(true)
    await axios.post('/api/artist-suggestion', body)
    setLoading(false)
    setDone(true)
  }

  return (
    <Modal bottom={bottom} onClose={onClose}>
      {done ? (
        <p>
          Thanks! We&apos;re working on partnering with new artists all the
          time, so check back soon.
        </p>
      ) : (
        <Form<SuggestArtistSchema>
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, valid }) => (
            <motion.form onSubmit={handleSubmit} {...wrapperAttrs}>
              <h2 className='mb-6 text-xl font-bold'>Suggest an artist</h2>
              <p className='mb-8'>
                If you’re an artist and would like your own page, or a fan
                wanting to suggest an artist to see featured, let us know below.
              </p>
              <Input
                name='name'
                label='Artist Name'
                placeholder='e.g. Amy Sherald'
              />
              <Input name='url' label='Link to their work' type='url' />
              <Input
                name='email'
                label='Email'
                type='email'
                placeholder='Just in case we have questions'
              />
              <Button disabled={!valid} loading={loading}>
                Submit
              </Button>
            </motion.form>
          )}
        />
      )}
    </Modal>
  )
}
