import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_API_KEY

const Filter = ({handleFilterChange}) => {
  return (
    <div>
      find countries <input onChange={(e) => {handleFilterChange(e)}} />
    </div>
  )
}

const Weather = (latlng) => {
  const [weather, setWeather] = useState([])
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latlng.latlng[0]}&lon=${latlng.latlng[1]}&appid=${api_key}&units=metric`

  useEffect(() => {
    axios.get(url).then(response => {
      setWeather(response.data)
    })
  }, [url])

  return (
    <div>
      {weather.main && <div>
        <h3>Weather in {weather.name}</h3>
        <p>temperature: {weather.main.temp} Celsius</p>
        <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
        <p>wind: {weather.wind.speed} m/s</p>
      </div>}
  </div>
  )
}

const Country = ({country}) => {

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.svg} alt={country.flags.alt} width="100" />
      <Weather latlng={country.latlng}/>
    </div>
  )
}

const Countries = ({countries, setFilteredCountries}) => {
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, be more specific
      </div>
    )
  } else if (countries.length === 1) {
    return (
      <div>
        <Country country={countries[0]} />
      </div>
    )
  } else {
    return (
      <div>
        {countries.map(country => <div key={country.name.common}>{country.name.common} <button onClick={() => {setFilteredCountries([country])}}>show</button></div>)}
      </div>
    )
  }
}


function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  const handleFilterChange = (event) => {
    const filterStr = event.target.value
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filterStr.toLowerCase()))
    setFilteredCountries(filteredCountries)
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter handleFilterChange={handleFilterChange} />
      <Countries countries={filteredCountries} setFilteredCountries={setFilteredCountries}/>
    </div>
  )
}

export default App