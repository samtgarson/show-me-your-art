import React, { FC, useState } from 'react'
import { Artist } from '~/src/artists'
import { Modal } from '../modal'
import { Confirmation } from './confirmation'
import { SubmitForm } from './form-wrapper'

export const SubmitModal: FC<{ artist: Artist }> = ({ artist }) => {
  const [complete, setComplete] = useState(false)

  return (
    <Modal>
      {complete ? (
        <Confirmation />
      ) : (
        <SubmitForm artist={artist} done={() => setComplete(true)} />
      )}
    </Modal>
  )
}
