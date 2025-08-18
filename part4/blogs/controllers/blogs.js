const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
	response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
	const user = request.user
	const blog = new Blog({ ...request.body, user: user._id })
	const saved = await blog.save()
	user.blogs = user.blogs.concat(saved._id)
	await user.save()

	response.status(201).json(saved)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
	const user = request.user
	const id = request.params.id
	const blog = await Blog.findById(id)
	if (!blog) {
		return response.status(404).json({ error: 'blog not found' })
	}
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