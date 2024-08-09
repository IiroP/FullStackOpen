import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
const apiKey = import.meta.env.VITE_OPENWEATHERMAP

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  // Load countries from server
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filtered = () => {
    if (filter === "" || !countries) {
      return countries
    }
    const result = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    return result
  }


  return (
    <>
      <h1>Countries</h1>
      Filter: <input onChange={handleFilterChange} /> <br />
      <CountryList countries={filtered()} setFilter={setFilter} />
    </>
  )
}

const CountryList = ({ countries, setFilter }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
    return (
      <div>
        {countries.map(country =>
          <p key={country.name.common}>{country.name.common}
            <button onClick={() => setFilter(country.name.common)}>Show</button>
          </p>
        )}
      </div>
    )
  }
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState([])
  const latlong = country.capitalInfo.latlng

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlong[0]}&lon=${latlong[1]}&appid=${apiKey}&units=metric`)
      .then(response => setWeather(response.data))
  }, [])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(lang => <li key={lang[1]}>{lang[1]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      <Weather weather={weather} />
    </div>
  )
}

const Weather = ({ weather }) => {
  if (weather.length === 0) {
    return (
      <p>Loading weather</p>
    )
  } else {
    return (
      <>
        <p>Temperature: {weather.main.temp} °C</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <p>Wind: {weather.wind.speed} m/s</p>
      </>
    )
  }
}

export default App
