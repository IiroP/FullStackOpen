import axios from "axios";
const baseUrl = '/api/persons'

const create = person => {
	return axios.post(baseUrl, person)
}

const getAll = () => {
	return axios.get(baseUrl)
}

const remove = (id) => {
	return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, person) => {
	return axios.put(`${baseUrl}/${id}`, person)
}

export default { create, getAll, remove, update }