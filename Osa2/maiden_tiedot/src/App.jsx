import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({value, onChange}) => {
  return (
    <div>find countries <input value={value} onChange={onChange}/></div>
  )
}

const Country = ({country, weather, loading}) => {
  if (loading) {
    return <p>Loading weather data...</p>
  }
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>
      capital {country.capital}<br/>
      area {country.area}<br/>
      population {country.population}
      </p>
      <h3>languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png}/>
      <h2>Weather in {country.capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Countries = ({countries, search, showCountry, weather, loading}) => {
  const filtered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
  if (search === '') {
    return <p>Please search for countries</p>
  } else if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (filtered.length <= 10 && filtered.length > 1) {
    return filtered.map(country => <p key={country.name.common}>{country.name.common}<button onClick={() => showCountry(country)}>show</button></p>)
  } else if (filtered.length == 1) {
    return <Country country={filtered[0]} weather={weather} loading={loading}/>
  } else return <p>No matches found</p>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    countryService
    .getAll()
    .then(countries => {
      setCountries(countries)
    })
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true)
      const lat = selectedCountry.capitalInfo.latlng[0]
      const lon = selectedCountry.capitalInfo.latlng[1]
      weatherService.getPlace(lat, lon)
        .then(weather => {
          setWeather(weather)
          setLoading(false)
        })
    }
  }, [selectedCountry])

  const handleSearch = (event) => setSearch(event.target.value)

  const showCountry = country => {
    setSearch(country.name.common)
    setSelectedCountry(country)
  }


  return (
    <div>
      <Filter value={search} onChange={handleSearch}/>
      <Countries countries={countries} search={search} showCountry={showCountry} weather={weather} loading={loading}/>
    </div>
  )

}

export default App