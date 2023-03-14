import { useState, useEffect } from "react";
import { getAll, create, deletePerson, update } from './serverCommunicator'

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number} <button onClick={() => handleDeletePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

const Filter = ({ filterPersons }) => {
  return (
    <div>
      filter shown with <input onChange={filterPersons} />
    </div>
  );
};

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={(e) => {addPerson(e)}}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button  type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const filterPersons = (event) => {
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setFilteredPersons(filteredPersons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

 const handleDeletePerson= (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setFilteredPersons(filteredPersons.filter((person) => person.id !== id));
      });
    }
  };

  useEffect(() => {
    getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, [])


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPersons={filterPersons} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(event) => setNewName(event.target.value)}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
