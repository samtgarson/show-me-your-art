import React, { FC } from 'react'
import { LocationSearchResult } from '../services/mapbox-client'

export const Location: FC<{ l: LocationSearchResult }> = ({ l }) => (
  <>
    {l.location}
    <span className='opacity-50'>, {l.area}</span>
  </>
)
