/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { renderHook, waitFor } from '@testing-library/react'
import useWeather, { UseWeatherProps } from '@/components/weather/useWeather'

const mockData = {
  success: {
    request: {
      type: 'City',
      query: 'Barcelona, Spain',
      language: 'en',
      unit: 'm',
    },
    location: {
      name: 'Barcelona',
      country: 'Spain',
      region: 'Catalonia',
      lat: '41.383',
      lon: '2.183',
      timezone_id: 'Europe/Madrid',
      localtime: '2023-11-17 07:46',
      localtime_epoch: 1700207160,
      utc_offset: '1.0',
    },
    current: {
      observation_time: '06:46 AM',
      temperature: 13,
      weather_code: 116,
      weather_icons: [
        'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png',
      ],
      weather_descriptions: ['Partly cloudy'],
      wind_speed: 15,
      wind_degree: 320,
      wind_dir: 'NW',
      pressure: 1022,
      precip: 0.1,
      humidity: 88,
      cloudcover: 25,
      feelslike: 11,
      uv_index: 1,
      visibility: 10,
      is_day: 'yes',
    },
  },
  failure: {
    success: false,
    error: {
      code: 123,
      type: 'Bad request',
      info: 'Error: mocked error for a bad request',
    },
  },
}

type HookResultType = ReturnType<typeof useWeather>

describe('useWeather', () => {
  it('hook returns initial loading, data, error', async () => {
    const fetchedData = mockData.success

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fetchedData),
      }),
    )

    const { result, unmount } = renderHook<HookResultType, UseWeatherProps>(
      () => useWeather({ location: 'Barcelona, Spain', unit: 'm' }),
    )

    const { loading, data, error } = result.current

    expect(loading).toBe(true)
    expect(data).toBe(undefined)
    expect(error).toBe(undefined)

    unmount()
  })

  it('hook returns updated loading, data, error', async () => {
    const fetchedData = mockData.success

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fetchedData),
      }),
    )

    const { result, unmount } = renderHook<HookResultType, UseWeatherProps>(
      () => useWeather({ location: 'Barcelona, Spain', unit: 'm' }),
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(undefined)

    await waitFor(() => expect(result.current.data).not.toBeUndefined())

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(fetchedData)
    expect(result.current.error).toBe(undefined)

    unmount()
  })

  it('hook returns updated loading, data, error when failure', async () => {
    const fetchedData = mockData.failure

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fetchedData),
      }),
    )

    const { result, unmount } = renderHook<HookResultType, UseWeatherProps>(
      () => useWeather({ location: 'Barcelona, Spain', unit: 'm' }),
    )

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBe(undefined)

    await waitFor(() => expect(result.current.error).not.toBeUndefined())

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeUndefined()

    unmount()
  })
})
