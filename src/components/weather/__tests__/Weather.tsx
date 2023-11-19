import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import mockData from './weather.data.json'
import Weather from '@/components/Weather'

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
