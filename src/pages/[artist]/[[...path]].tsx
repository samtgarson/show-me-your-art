import { GetServerSideProps, NextPage } from "next"
import React, { useCallback, useEffect, useState } from "react"
import { Map } from "~/src/components/map"
import { NavBar } from "~/src/components/nav-bar"
import { DataClient } from "~/src/services/data-client"
import { StateContext } from "~/src/services/state"
import { Submissions } from "~/types/data"

const Home: NextPage = () => {
  const [start, setStart] = useState(false)
  const client = DataClient.useClient()
  const [data, setData] = useState<Submissions>({})

  const fetchData = useCallback(async () => {
    const submissions = await client.getSubmissions()
    const newData = submissions.reduce((hsh, sub) => ({ ...hsh, [sub.id]: sub }), {})
    setData(d => ({ ...d, ...newData }))
  }, [client])

  useEffect(() => {
    fetchData()
    setTimeout(() => setStart(true), 0)
  }, [fetchData])

  return <StateContext.Provider value={{ start, data }}>
    <NavBar />
    <Map />
  </StateContext.Provider>
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query.artist !== 'enzo') return { notFound: true }

  const path = (query.path as string[] ?? []).join('/')
  switch (path) {
    case '':
    case 'about':
      return { props: {} }
    default:
      return { notFound: true }
  }
}

export default Home
