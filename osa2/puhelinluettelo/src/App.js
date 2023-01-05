import { useState, useEffect } from 'react'
import personService from "./services/persons"
import PersonForm from "./components/PersonForm"
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    personService.getAll().then(response => setPersons(response))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingIndex = persons.findIndex(person => person.name === newName)
    if (existingIndex === -1) {
      personService
        .addPerson(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName("")
          setNewNumber("")
          // Status message:
          setStatus(`${personObject.name} added succesfully`)
          setTimeout(() => {
            setStatus("")
          }, 5000)
        })
      
    } else {
      const confirmed = window.confirm(`${newName} is already added to phonebook, replace number?`)
      if (confirmed) {
        const id = persons[existingIndex].id
        personService
          .updatePerson({id, personObject})
          .then(response => {
            console.log(response)
            setPersons(persons.map(person => person.id !== id ? person : response))
            setNewName("")
            setNewNumber("")
            // Status message:
            setStatus(`${personObject.name} updated succesfully`)
            setTimeout(() => {
              setStatus("")
            }, 5000)
          })
          .catch(error => {
            setError(`Person "${personObject.name}" was already removed from the server`)
            setPersons(persons.filter(person => person.id !== id))
            setTimeout(() => {
              setError("")
            }, 5000)
          })
      }
    }
  }

  const deletePerson = id => {
    const name = persons.find(person => person.id === id).name
    const confirmed = window.confirm(`Do you want to remove ${name}?`)
    if (confirmed) {
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setStatus(`${name} removed succesfully`)
          setTimeout(() => {
            setStatus("")
          }, 5000)
        })
        .catch(error => {
          setError(error)
        })
      
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filtered = (list) => (
    list.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status={status} error={error} />
      <Filter action={handleFilterChange} />
      <h2>Add new contact</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filtered(persons)} deletePerson={deletePerson} />
    </div>
  )

}

export default App