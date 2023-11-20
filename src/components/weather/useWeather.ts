import { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'

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
  const [units, setUnits] = useState<Unit>(() => unit)
  const API_URL = `/api/weather/${encodeURIComponent(location)}/${units}`
  const {
    loading,
    error: fetchError,
    data: fetchData,
    refetch,
  } = useFetch<WeatherResponseType>(API_URL)

  useEffect(() => {
    refetch(API_URL)
  }, [location, units])

  let data: WeatherDataType | undefined
  let error: Error | string | undefined

  if (fetchData && 'success' in fetchData) {
    error = fetchData.error.info
  } else {
    data = fetchData
    error = fetchError
  }

  return { loading, data, error, setUnit: setUnits }
}
