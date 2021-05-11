const { createClient } = require('@supabase/supabase-js')
const Calipers = require('calipers')('png')
const randomLocation = require('random-location')
const { v4: uuid } = require('uuid')
const FormData = require('form-data')
const Axios = require('axios')
const fs = require('fs')
const { join } = require('path')

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabaseUrl = process.env.SUPABASE_URL
const client = createClient(supabaseUrl, supabaseKey)
const images = fs.readdirSync(join(__dirname, 'fixture-images/enzo'))
const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const createSubmission = async (image_id, center, radius, dims) => {
  const { latitude, longitude } = randomLocation.randomCirclePoint(center, radius)
  const name = sample(['Sam & Gabs', 'Jamin G', 'Laura H.', 'Tom Meyers'])
  const attrs = {
    latitude: `${latitude}`,
    longitude: `${longitude}`,
    artist: 'enzo',
    ...dims,
    image_id,
    name
  }

  return client.rpc('create_submission', attrs)
}

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`
}
const uploadFile = async (id, artist) => {
  const file = sample(images)
  const inputPath = join(__dirname, 'fixture-images', artist, file)
  const buffer = fs.readFileSync(inputPath)
  const form = new FormData()
  form.append('', buffer, id)
  await Axios.post(
    `${supabaseUrl}/storage/v1/object/submissions/${artist}/${id}`,
    form,
    { headers: { ...form.getHeaders(), ...headers } }
  )
  return inputPath
}

const getDimensions = async path => {
  const { pages: [{ width, height }] } = await Calipers.measure(path)
  return { width, height }
}

const seedSubmissions = async (
  points = 30,
  center = { latitude: 51.515579, longitude: -0.128360 },
  radius = 10000
) => {
  for (let i = 0; i < points; i++) {
    try {
      const image_id = uuid() + '.png'
      const path = await uploadFile(image_id, 'enzo')
      console.log(`Uploaded ${image_id}`)

      const dims = await getDimensions(path)
      const { data, error } = await createSubmission(image_id, center, radius, dims)
      if (error || !data) {
        console.error(error)
        break
      }
      console.log(`Created ${data[0].id}`)
    } catch (err) {
      console.error(err)
      break
    }
  }
}

seedSubmissions()
