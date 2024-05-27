import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Filter = ({value, onChange}) => {
  return (
    <div>find countries <input value={value} onChange={onChange}/></div>
  )
}

const Country = ({country}) => {
  console.log(country)
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
    </div>
  )
}

const Countries = ({countries, search}) => {
  const filtered = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
  if (search === '') {
    return <p>Please search for countries</p>
  } else if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (filtered.length <= 10 && filtered.length > 1) {
    return filtered.map(country => <p key={country.name.common}>{country.name.common}</p>)
  } else if (filtered.length == 1) {
    return <Country country={filtered[0]}/>
  } else return <p>No matches found</p>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')


  useEffect(() => {
    countryService
    .getAll()
    .then(countries => {
      setCountries(countries)
    })
}, [])

  const handleSearch = (event) => setSearch(event.target.value)

  return (
    <div>
      <Filter value={search} onChange={handleSearch}/>
      <Countries countries={countries} search={search}/>
    </div>
  )

}

export default App