const Persons = (props) => {
	return (
		<>
			{props.filteredPersons.map(person =>
				<p key={person.name}>{person.name} ({person.number}) <button onClick={() => props.deleteAction(person)}>Delete</button></p>
			)}
		</>
	)
}

export default Persons