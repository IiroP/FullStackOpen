import { useState, useEffect } from 'react'
import axios from "axios"

const Filter = ({ action }) => (
  <div>
    Query: <input onChange={action} />
  </div>
)

const Result = ({countries, setFilter}) => {
  if (countries.length > 10) {
    return (
      <div>
        <h2>Result</h2>
        <p>Too many matches</p>
      </div>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  } else {
    return (
      <div>
        <h2>Result</h2>
        {countries.map(country => <ListCountry key={country.cca2} country={country} setFilter={setFilter} />)}
      </div>
    )
  }
}

const ListCountry = ({country, setFilter}) => (
  <li>
    {country.name.common}
    <button onClick={() => setFilter(country.name.common)}>Show</button>
  </li>
)

const Country = ({country}) => {
  const [weather, setWeather] = useState([])
  const latlong = country.capitalInfo.latlng

  useEffect(() => {
    const apiKey = process.env.REACT_APP_WEATHER_API
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlong[0]}&lon=${latlong[1]}&appid=${apiKey}&units=metric`)
      .then(response => setWeather(response.data))
  }, [])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.entries(country.languages).map(lang => <li key={lang[0]}>{lang[1]}</li>)}
      </ul>
      <h3>Flag</h3>
      <img alt="flag" src={country.flags.png}/>
      <h3>Weather in {country.capital[0]}</h3>
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

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => setCountries(response.data))
  }, [])

  const filtered = (list) => (
    list.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div>
      <h1>Country information</h1>
      <Filter action={handleFilterChange} />
      <Result countries={filtered(countries)} setFilter={setFilter} />
    </div>
  )

}

export default App