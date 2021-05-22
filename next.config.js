module.exports = {
  publicRuntimeConfig: {
    mapboxApiToken: process.env.MAPBOX_API_TOKEN,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    prelaunch: process.env.PRELAUNCH !== undefined
  },
  future: {
    webpack5: true,
  },
  images: {
    domains: [process.env.SUPABASE_URL.replace('https://', '')],
  }
}
