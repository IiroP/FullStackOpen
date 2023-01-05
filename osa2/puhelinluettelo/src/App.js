import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({action}) => (
  <div>
    filter with text: <input onChange={action} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons}) => (
  persons.map(person => <Person key={person.id} person={person} />)
)

const Person = ({person}) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.findIndex(person => person.name === newName) === -1) {
      setPersons(persons.concat({ 
        name: newName,
        number: newNumber
      }))
    } else {
      alert(`${newName} is already added to phonebook`)
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
      <Persons persons={filtered(persons)} />
    </div>
  )

}

export default App