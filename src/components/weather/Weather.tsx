import { FC, createContext, PropsWithChildren, useContext } from 'react'
import { pickChildrenByType } from '@/utils'
import Image from 'next/image'
import useWeather, { Unit } from './useWeather'
import styles from './styles/Weather.module.css'

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
    <h2
      className={styles.weatherLoading}
      data-testid="weather-loading"
    >
      Loading weather data...
    </h2>
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
    <h2
      className={styles.weatherError}
      data-testid="weather-error"
    >
      {error.toString()}
    </h2>
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
      <h1 className="weather-location">
        {`${data.location.name}, ${data.location.country}`}
      </h1>
      <div>
        <Image
          className={styles.weatherIcon}
          alt="weather"
          src={data.current.weather_icons[0]}
          height={64}
          width={64}
        />
      </div>
      <h1>{`${data.current.temperature}${
        UnitToTemperatureAbbreviations[data.request.unit]
      }`}</h1>
      <h2>{`${data.current.weather_descriptions[0]} `}</h2>
      <h3>{`Wind: ${data.current.wind_degree}° ${data.current.wind_dir}, ${
        data.current.wind_speed
      } ${UnitToSpeedNames[data.request.unit]}`}</h3>
      <h3>{`${new Date(data.location.localtime).toLocaleDateString()}`}</h3>
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
