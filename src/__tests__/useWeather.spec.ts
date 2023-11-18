import '@testing-library/jest-dom'
import { renderHook, waitFor } from '@testing-library/react'
import { mockData } from './mockData/weather'
import useWeather, { UseWeatherProps } from '@/components/weather/useWeather'

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
