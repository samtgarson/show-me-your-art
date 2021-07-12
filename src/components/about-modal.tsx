import React, { FC } from 'react'
import { Artist } from '../artists'
import { Modal } from './modal'

export const AboutModal: FC<{ artist?: Artist }> = ({ artist }) => (
  <Modal>
    <p className='mb-4 text-lg'>
      Show Me Your Art is celebrating the artist, the art travelling the world
      and the appreciation of it in our spaces.
    </p>

    <p className='mb-48 text-lg'>
      Submit yours and explore where others have theirs.
    </p>
    {artist?.link && (
      <p className='mb-10'>
        {artist.name} prints available from{' '}
        <a href={artist.link.url}>{artist.link.title}</a>
      </p>
    )}
    <small className='px-10 pt-10 mt-auto -mx-10 border-t border-white'>
      A project by{' '}
      <a href='https://jamingalea.com' target='_blank' rel='noreferrer'>
        Jamin Galea
      </a>{' '}
      and{' '}
      <a href='https://samgarson.com' target='_blank' rel='noreferrer'>
        Sam Garson
      </a>{' '}
      <br />
      <a href='mailto:hello@showmeyour.art'>hello@showmeyour.art</a>
    </small>
  </Modal>
)
