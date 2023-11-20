import { useEffect, useState } from 'react'

const useFetch = <T>(url: URL | string) => {
  const [_url, setUrl] = useState(() => url)
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error | string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [loadCount, setLoadCount] = useState<number>(0)

  function refetch(newUrl?: URL | string) {
    if (newUrl) {
      setUrl(newUrl)
    } else {
      setLoadCount((count) => count + 1)
    }
  }

  useEffect(() => {
    setData(undefined)
    setError(undefined)
    setLoading(true)
    async function getData() {
      try {
        const response = await fetch(url)
        if (response.ok) {
          const json: T = await response.json()
          setData(json)
        } else {
          setError('Fetch response not ok. Url: ${url}')
        }
      } catch (e: unknown) {
        if (typeof e === 'string' || e instanceof Error) {
          setError(e)
        } else {
          setError('Unknown fetch error ocurred: ${url}')
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [_url, loadCount])

  return { data, error, loading, refetch }
}

export default useFetch
