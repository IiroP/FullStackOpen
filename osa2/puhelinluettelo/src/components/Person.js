const Person = ({ person, deletePerson }) => {
	return (
		<p>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>Delete</button></p>
	)
}

export default Person