import React, { FC } from 'react'
import { Artist } from '../artists'
import { Modal } from './modal'

export const AboutModal: FC<{ artist: Artist }> = () => (
  <Modal>
    <p className='mb-4 text-lg'>
      Show Me Your Art is celebrating the artist, the art traveling the world
      and the appreciation of it in our spaces.
    </p>

    <p className='text-lg'>
      Submit yours and explore where others have theirs.
    </p>
    <small className='px-10 pt-10 mt-auto -mx-10 border-t border-white'>
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
      <a href='mailto:hello@showmeyour.art' className='underline'>
        hello@showmeyour.art
      </a>
    </small>
  </Modal>
)
