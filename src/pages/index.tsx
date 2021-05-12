import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <Link href='/enzo'>
      <a>Enzo</a>
    </Link>
  )
}

export default Home
