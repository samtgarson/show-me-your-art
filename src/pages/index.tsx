import React, { useCallback, useState } from 'react'
import { NextPage } from "next"
import { Map } from '../components/map'
import { DataClient } from '../services/data-client'
import { Coordinates, Submissions } from '~/types/data'

const Home: NextPage = () => {
  const client = DataClient.useClient()
  const [data, setData] = useState<Submissions>({})

  const fetchData = useCallback(async (coordinates: Coordinates) => {
    const submissions = await client.getSubmissions(coordinates)
    const newData = submissions.reduce((hsh, sub) => ({ ...hsh, [sub.id]: sub }), {})
    setData({ ...data, ...newData })
  }, [data, client])

  return <Map data={data} fetchData={fetchData} />
}

export default Home
