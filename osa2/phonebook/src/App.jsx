import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import "./index.css"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [filter, setFilter] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [error, setError] = useState(false)

  // Load initial data from server
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    // Person exists
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added, do you want to update the number?`)) {
        updatePerson()
      }
      return
    }

    const person = { name: newName, number: newNumber }
    personService
      .create(person)
      .then(response => {
        setPersons(persons.concat(response.data))
        displayNotification(`Added ${person.name}`)
      })
      .catch(error => {
        console.error(error.response.data.error)
        displayNotification(error.response.data.error, true)
      })

  }

  const updatePerson = () => {
    const person = persons.find(p => p.name === newName)
    personService
      .update(person.id, { ...person, number: newNumber })
      .then(response => {
        setPersons(persons.map(p => p.id !== person.id ? p : response.data))
        displayNotification(`Updated ${person.name}`)
      })
      .catch(error => {
        console.error(error.response.data.error)
        displayNotification(error.response.data.error, true)
      })
  }

  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          displayNotification(`Deleted ${person.name}`)
        })
    }
  }

  const displayNotification = (msg, error) => {
    setNotificationMsg(msg)
    setError(error)
    setTimeout(() => {
      setNotificationMsg(null)
    }, 5000)
  }

  const filteredPersons = filter.length > 0 ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} error={error} />
      <Filter onChange={handleFilterChange} />
      <h2>Save new number</h2>
      <Form onSubmit={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deleteAction={removePerson} />
    </div>
  )
}

export default App