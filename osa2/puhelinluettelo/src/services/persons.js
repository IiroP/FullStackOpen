import axios from "axios"

const baseUrl = "/api/persons"

const addPerson = personObject => {
	const request = axios.post(baseUrl, personObject)
	return request.then(response => response.data)
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const deletePerson = id => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(response => response.data)
}

const updatePerson = ({id, personObject}) => {
	const request = axios.put(`${baseUrl}/${id}`, personObject)
	return request.then(response => response.data)
}

export default { addPerson, getAll, deletePerson, updatePerson }