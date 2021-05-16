import React, { FC } from 'react'
import { Modal } from './modal'

export const AboutModal: FC<{ artist: string }> = () => (
  <Modal>
    <p className='text-lg mb-4'>
      Show Me Your Art is celebrating the artist, the art traveling the world
      and the appreciation of it in our spaces.
    </p>

    <p className='text-lg'>
      Submit yours and explore where others have theirs.
    </p>
    <small className='mt-auto'>
      A project by{' '}
      <a
        className='underline'
        href='https://samgarson.com'
        target='_blank'
        rel='noreferrer'
      >
        Sam Garson
      </a>{' '}
      and{' '}
      <a
        href='https://jamingalea.com'
        target='_blank'
        rel='noreferrer'
        className='underline'
      >
        Jamin Galea
      </a>
      <br />
      Get in touch: hello@showmeyour.art
    </small>
  </Modal>
)
