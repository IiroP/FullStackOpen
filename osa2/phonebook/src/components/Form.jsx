const Form = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>
				name: <input onChange={props.handleNameChange} /> <br />
				number: <input onChange={props.handleNumberChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

export default Form