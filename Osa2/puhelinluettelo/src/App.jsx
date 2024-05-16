import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => {
  return (
    <div>filter shown with: <input value={value} onChange={onChange}/></div>
  )
}

const PersonForm = ({newName, newNumber, handleNewName, handleNewNumber, addPerson}) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNewName}/></div>
      <div>number: <input value={newNumber} onChange={handleNewNumber}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Person = ({name, number}) => <p>{name} {number}</p>

const Persons = ({persons, search}) => persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person => <Person key={person.name} name={person.name} number={person.number}/>)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook.`)
      setNewName("")
      setNewNumber("")
    } else {
    setPersons(persons.concat({name: newName, number: newNumber}))
    setNewName("")
    setNewNumber("")
    }
  }

  const handleNewName = (event) => setNewName(event.target.value)
  const handleNewNumber = (event) => setNewNumber(event.target.value)
  const handleSearch = (event) => setSearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={search} onChange={handleSearch}/>
      <h3>add a new</h3>
      <PersonForm 
      newName={newName} 
      handleNewName={handleNewName} 
      newNumber={newNumber} 
      handleNewNumber={handleNewNumber} 
      addPerson={addPerson}/>
      <h3>Numbers</h3>
      <Persons persons={persons} search={search}/>
    </div>
  )

}

export default App