const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const token = jwt.verify(request.token, process.env.SECRET)
	if (!token.id) {
		return response.status(401).json({ error: 'invalid token' })
	}
	const user = await User.findById(token.id)
	if (!user) {
		return response.status(401).json({ error: 'user not found' })
	}
	const blog = new Blog({ ...request.body, user: user._id })
	const saved = await blog.save()
	user.blogs = user.blogs.concat(saved._id)
	await user.save()

	response.status(201).json(saved)
})

blogsRouter.delete('/:id', async (request, response) => {
	const token = jwt.verify(request.token, process.env.SECRET)
	if (!token.id) {
		return response.status(401).json({ error: 'invalid token' })
	}
	const user = await User.findById(token.id)
	if (!user) {
		return response.status(401).json({ error: 'user not found' })
	}
	const id = request.params.id
	const blog = await Blog.findById(id)
	if (blog.user.toString() !== user._id.toString()) {
		return response.status(401).json({ error: 'unauthorized' })
	}
	await Blog.findByIdAndDelete(id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const updated = await Blog.findByIdAndUpdate(id, request.body, { new: true })
	response.json(updated)
})

module.exports = blogsRouter