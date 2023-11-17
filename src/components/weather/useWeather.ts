import { useState, useEffect } from 'react'

export type Unit = 'm' | 'f'

export type WeatherDataType = {
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

export type WeatherFailureType = {
  success: false
  error: {
    code: number
    type: string
    info: string
  }
}

export type WeatherResponseType = WeatherDataType | WeatherFailureType

export interface UseWeatherProps {
  location: string
  unit: Unit
}

export default function useWeather({ location, unit }: UseWeatherProps) {
  const [data, setData] = useState<WeatherDataType>()
  const [error, setError] = useState<Error | string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [units, setUnits] = useState<Unit>(() => unit)

  useEffect(() => {
    setLoading(true)
    setError(undefined)
    setData(undefined)

    const API_URL = `/api/weather/${encodeURIComponent(location)}/${units}`

    async function getWeatherData() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          setError(`API response not ok: ${response.statusText}`)
        } else {
          const json = (await response.json()) as WeatherResponseType
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
