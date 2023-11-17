import { useState, useEffect } from 'react'

const API_ACCESS_KEY = '0701ed3dbd5e9f686716e3c76cd0eb99'

export type Unit = 'm' | 'f'
export type WeatherData = {
  request: {
    type: string
    query: string
    language: string
    unit: Unit
  }
  location: {
    name: string
    country: string
    region: string
    lat: string
    lon: string
    timezone_id: string
    localtime: string
    localtime_epoch: number
    utc_offset: string
  }
  current: {
    observation_time: string
    temperature: number
    weather_code: number
    weather_icons: string[]
    weather_descriptions: string[]
    wind_speed: number
    wind_degree: number
    wind_dir: string
    pressure: number
    precip: number
    humidity: number
    cloudcover: number
    feelslike: number
    uv_index: number
    visibility: number
    is_day: 'yes' | 'no'
  }
}

export type WeatherFailure = {
  success: false
  error: {
    code: number
    type: string
    info: string
  }
}

export type WeatherResponse = WeatherData | WeatherFailure

export interface UseWeatherProps {
  location: string
  unit: Unit
}

export default function useWeather({ location, unit }: UseWeatherProps) {
  const [data, setData] = useState<WeatherData>()
  const [error, setError] = useState<Error | string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [units, setUnits] = useState<Unit>(() => unit)

  useEffect(() => {
    setLoading(true)
    setError(undefined)
    setData(undefined)
    const API_URL = new URL(
      `http://api.weatherstack.com/current?access_key=${API_ACCESS_KEY}&query=${location}&units=${units}`,
    )

    async function getWeatherData() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          setError(`API response not ok: ${response.statusText}`)
        } else {
          const json = (await response.json()) as WeatherResponse
          if ('success' in json) {
            setError(json.error.info)
          } else {
            setData(json)
          }
        }
      } catch (e: unknown) {
        if (typeof e === 'string') {
          setError(e)
        } else if (e instanceof Error) {
          setError(e)
        } else {
          setError('An error ocurred fetching weather data')
        }
      }
      setLoading(false)
    }
    getWeatherData()
  }, [location, units])

  return { loading, data, error, setUnit: setUnits }
}
