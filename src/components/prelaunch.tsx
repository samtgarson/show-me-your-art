import React, { FC } from 'react'
import { Marquee } from './marquee'

export const Prelaunch: FC = () => {
  return (
    <div className='fixed flex items-center w-screen h-screen text-white bg-black'>
      <Marquee>
        <div
          className='flex items-center flex-grow block font-bold whitespace-nowrap'
          style={{ fontSize: '10vh', lineHeight: 1 }}
        >
          Show me your
          <span className='text-[2vh] px-4 py-3 bg-[#404040] mx-16'>
            Coming Soon
          </span>
        </div>
      </Marquee>
      <p className='fixed bottom-0 left-0 w-screen p-4 text-center normal-text'>
        A project by <a href='https://jamingalea.com'>Jamin Galea</a> and{' '}
        <a href='https://samgarson.com'>Sam Garson</a>
      </p>
    </div>
  )
}
