/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Weather from '@/components/weather/Weather'

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

describe('Weather', () => {
  it('renders component root', async () => {
    render(
      <Weather location="Barcelona, Spain">
        <Weather.Data />
      </Weather>,
    )

    const weatherRoot = screen.getByTestId('weather-root')
    expect(weatherRoot).toBeInTheDocument()
  })

  it('renders component loading & data', async () => {
    const data = mockData.success

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      }),
    )
    render(
      <Weather location="Barcelona, Spain">
        <Weather.Loading />
        <Weather.Data />
      </Weather>,
    )

    const weatherLoading = screen.getByTestId('weather-loading')
    expect(weatherLoading).toBeInTheDocument()

    const weatherData = await screen.findByTestId('weather-data')
    expect(weatherData).toBeInTheDocument()
  })

  it('renders component error', async () => {
    const data = mockData.failure

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      }),
    )
    render(
      <Weather location="Barcelona, Spain">
        <Weather.Loading />
        <Weather.Error />
        <Weather.Data />
      </Weather>,
    )

    const weatherLoading = screen.getByTestId('weather-loading')
    expect(weatherLoading).toBeInTheDocument()

    const weatherError = await screen.findByTestId('weather-error')
    expect(weatherError).toBeInTheDocument()
  })

  it('re-renders and reloads data when units changed', async () => {
    const data = mockData.success

    global['fetch'] = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      }),
    )
    render(
      <Weather location="Barcelona, Spain">
        <Weather.Loading />
        <Weather.Error />
        <Weather.Data />
      </Weather>,
    )

    let weatherLoading = screen.getByTestId('weather-loading')
    expect(weatherLoading).toBeInTheDocument()

    let weatherData = await screen.findByTestId('weather-data')
    expect(weatherData).toBeInTheDocument()

    const unitsButton = screen.getByRole('button')
    expect(unitsButton).toBeInTheDocument()

    fireEvent.click(unitsButton)

    weatherLoading = screen.getByTestId('weather-loading')
    expect(weatherLoading).toBeInTheDocument()

    weatherData = await screen.findByTestId('weather-data')
    expect(weatherData).toBeInTheDocument()
  })
})
