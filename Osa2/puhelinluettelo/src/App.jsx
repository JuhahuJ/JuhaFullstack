import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

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

const Person = ({name, number, deletePerson}) => <p>{name} {number} <button onClick={deletePerson}>delete</button></p>

const Persons = ({persons, search, deletePerson}) => {
  return persons
    .filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    .map(person => (
      <Person 
        key={person.name} 
        name={person.name} 
        number={person.number} 
        deletePerson={() => deletePerson(person.id)}
      />
  ))
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService
    .getAll()
    .then(persons => {
      setPersons(persons)
    })
}, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {name: newName, number: newNumber}
    if (persons.some(person => person.name === newName)) {
      if (confirm(`${newName} is already added to phonebook. Do you want to replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newName).id
        personService
        .update(id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName("")
          setNewNumber("")
        })
        setNewName("")
        setNewNumber("")
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
        })
    }
  }

  const deletePerson = id => {
    if (confirm(`Do you want to delete ${persons.find(person => person.id === id).name}?`)) {
      personService.deletion(id)
      setPersons(persons.filter(person => person.id !== id))
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
      <Persons persons={persons} search={search} deletePerson={deletePerson}/>
    </div>
  )

}

export default App