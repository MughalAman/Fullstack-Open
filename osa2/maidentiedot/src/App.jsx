import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({handleFilterChange}) => {
  return (
    <div>
      find countries <input onChange={(e) => {handleFilterChange(e)}} />
    </div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={`flag of ${country.name}`} width="100" />
    </div>
  )
}

const Countries = ({countries}) => {
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
        {countries.map(country => <div key={country.name}>{country.name}</div>)}
      </div>
    )
  }
}


function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  const handleFilterChange = (event) => {
    const filterStr = event.target.value
    const filteredCountries = countries.filter(country => country.name.common.toString().toLowerCase().includes(filterStr.toString().toLowerCase()))
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
      <Countries countries={filteredCountries} />
    </div>
  )
}

export default App