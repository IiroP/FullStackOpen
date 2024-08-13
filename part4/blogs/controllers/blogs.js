const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)
	const saved = await blog.save()
	response.status(201).json(saved)
})

blogsRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	await Blog.findByIdAndDelete(id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const updated = await Blog.findByIdAndUpdate(id, request.body, { new: true })
	response.json(updated)
})

module.exports = blogsRouter