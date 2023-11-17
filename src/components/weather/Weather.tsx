import { FC, createContext, PropsWithChildren, useContext } from 'react'
import { pickChildrenByType } from '@/utils'
import Image from 'next/image'
import useWeather, { Unit, WeatherData } from './useWeather'
import styles from './Weather.module.css'

type TemperatureNames = 'Celsius' | 'Fahrenheit'
type TemperatureAbbreviations = '°C' | '°F'
type SpeedNames = 'Kilometers/Hour' | 'Miles/Hour'

const ToggledUnitToTemperatureNames: Record<Unit, TemperatureNames> = {
  f: 'Celsius',
  m: 'Fahrenheit',
}

const UnitToTemperatureAbbreviations: Record<Unit, TemperatureAbbreviations> = {
  m: '°C',
  f: '°F',
}

const UnitToSpeedNames: Record<Unit, SpeedNames> = {
  m: 'Kilometers/Hour',
  f: 'Miles/Hour',
}

type WeatherValueType = ReturnType<typeof useWeather>

const WeatherContext = createContext<WeatherValueType | undefined>(undefined)

function WeatherLoading() {
  const context = useContext(WeatherContext)

  if (context === undefined) {
    throw new Error('<WeatherLoading /> must be a child of <Weather />')
  }

  return context.loading ? (
    <div
      className={styles.weatherLoading}
      data-testid="weather-loading"
    >
      <strong>Loading weather data...</strong>
    </div>
  ) : null
}

function WeatherError() {
  const context = useContext(WeatherContext)

  if (context === undefined) {
    throw new Error('<WeatherError /> must be a child of <Weather />')
  }

  const { error, loading } = context
  const isError = !loading && error

  return isError ? (
    <div
      className={styles.weatherError}
      data-testid="weather-error"
    >
      <strong>{error.toString()}</strong>
    </div>
  ) : null
}

function WeatherData() {
  const context = useContext(WeatherContext)

  if (context === undefined) {
    throw new Error('<WeatherData /> must be a child of <Weather />')
  }

  const { loading, data, setUnit } = context
  const toggleUnit = () => {
    setUnit((u) => {
      return u === 'm' ? 'f' : 'm'
    })
  }
  const hasData = !loading && data

  return hasData ? (
    <div
      className={styles.weatherData}
      data-testid="weather-data"
    >
      <h1 style={{ marginBottom: 16 }}>Current Weather</h1>
      <h2 style={{ marginBottom: 16 }}>
        {`Location: ${data.location.name}, ${data.location.region}, ${data.location.country}`}
      </h2>
      <h2 style={{ marginBottom: 16 }}>{`Date: ${new Date(
        data.location.localtime,
      ).toLocaleDateString()}`}</h2>
      <h3>
        {`Description: ${data.current.weather_descriptions[0]} `}
        <Image
          alt="weather"
          src={data.current.weather_icons[0]}
          height={16}
          width={16}
          style={{ borderRadius: '50%', verticalAlign: 'middle' }}
        />
      </h3>
      <h3>{`Temperature: ${data.current.temperature} ${
        UnitToTemperatureAbbreviations[data.request.unit]
      }`}</h3>
      <h3>{`Wind: ${data.current.wind_degree}° ${data.current.wind_dir}, ${
        data.current.wind_speed
      } ${UnitToSpeedNames[data.request.unit]}`}</h3>
      <button
        className={styles.unitsButton}
        onClick={toggleUnit}
      >
        {`To ${ToggledUnitToTemperatureNames[data.request.unit]}`}
      </button>
    </div>
  ) : null
}

type WeatherProps = PropsWithChildren<{ location: string }>

const Weather: FC<WeatherProps> & {
  Loading: typeof WeatherLoading
} & {
  Error: typeof WeatherError
} & { Data: typeof WeatherData } = ({ location, children }) => {
  if (!pickChildrenByType(children, WeatherData)[0]) {
    throw new Error('<Weather /> must have a <Weather.WeatherData /> child')
  }

  const { loading, data, error, setUnit } = useWeather({ location, unit: 'm' })

  return (
    <WeatherContext.Provider value={{ loading, data, error, setUnit }}>
      <div
        data-testid="weather-root"
        className={styles.weatherRoot}
      >
        {children}
      </div>
    </WeatherContext.Provider>
  )
}

Weather.Loading = WeatherLoading
Weather.Error = WeatherError
Weather.Data = WeatherData

export default Weather
