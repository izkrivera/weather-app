import { NextApiHandler } from 'next'

const API_ACCESS_KEY = '0701ed3dbd5e9f686716e3c76cd0eb99'

const handler: NextApiHandler = async (req, res) => {
  console.info()

  if (req.method === 'GET') {
    const location = decodeURIComponent(req.query.location as string)
    const unit = req.query.unit as string

    const API_URL = new URL(
      `http://api.weatherstack.com/current?access_key=${API_ACCESS_KEY}&query=${location}&units=${unit}`,
    )

    const dataResponse = await fetch(API_URL)
    const json = await dataResponse.json()

    return res.status(dataResponse.status).json(json)
  }
  return res.status(405).json({ error: `${req.method} not allowed` })
}

export default handler
