import axios from "axios";

const create = person => {
	return axios.post('http://localhost:3001/persons', person)
}

const getAll = () => {
	return axios.get('http://localhost:3001/persons')
}

const remove = (id) => {
	return axios.delete('http://localhost:3001/persons/' + id)
}

const update = (id, person) => {
	return axios.put('http://localhost:3001/persons/' + id, person)
}

export default { create, getAll, remove, update }