const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
	{
		title: 'Sample blog',
		author: 'Not me',
		url: 'https://fullstackopen.com',
		likes: 100
	},
	{
		title: 'Another blog',
		author: 'Author Name',
		url: 'https://example.com',
		likes: 50
	},
	{
		title: 'Tech Trends',
		author: 'Tech Guru',
		url: 'https://techexample.com',
		likes: 75
	},
	{
		title: 'Cooking 101',
		author: 'Chef Master',
		url: 'https://cookingblog.com',
		likes: 20
	},
]

beforeEach(async () => {
	await Blog.deleteMany({})

	for (let blog of initialBlogs) {
		let newBlog = new Blog(blog)
		await newBlog.save()
	}
})

describe('blog list', () => {
	test('blogs are returned as JSON', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		assert.strictEqual(response.body.length, initialBlogs.length)
	})

	test('blog id parameter is correctly named', async () => {
		const response = await api.get('/api/blogs')
		const blog = response.body[0]
		assert(blog.id)
		assert(!(blog._id))
	})

})

describe('blog creation', () => {
	test('succeeds with valid data', async () => {
		const anotherBlog = {
			title: 'Another blog',
			author: 'Secret Identity',
			url: 'https://anotherblog.com',
			likes: 20
		}
		await api
			.post('/api/blogs')
			.send(anotherBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		assert.strictEqual(response.body.length, initialBlogs.length + 1)
		assert.strictEqual(response.body[initialBlogs.length].content, anotherBlog.content)
	})

	test('assigns likes to be 0 if not defined', async () => {
		const anotherBlog = {
			title: 'Another blog',
			author: 'Secret Identity',
			url: 'https://anotherblog.com',
		}

		const response = await api
			.post('/api/blogs')
			.send(anotherBlog)

		assert.strictEqual(response.body.likes, 0)
	})


	test('fails with status 400 if url missing', async () => {
		const anotherBlog = {
			title: 'Yet Another blog',
			author: 'More Secret Identity',
			likes: 100
		}

		await api
			.post('/api/blogs')
			.send(anotherBlog)
			.expect(400)
	})

	test('fails with status 400 if title missing', async () => {
		const anotherBlog = {
			author: 'Even More Secret Identity',
			likes: 101
		}

		await api
			.post('/api/blogs')
			.send(anotherBlog)
			.expect(400)
	})
})

describe('blog deletion', () => {
	test('succeeds for existing blogs', async () => {
		const response = await api.get('/api/blogs')
		const blog = response.body[0]

		await api
			.delete(`/api/blogs/${blog.id}`)
			.expect(204)

		const blogsAtEnd = await api.get('/api/blogs')
		assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

		const ids = blogsAtEnd.body.map(blog => blog.id)
		assert(!ids.includes(blog.id))
	})
})

describe('updating blog list entry', () => {
	test('succeeds with new title', async () => {
		const response = await api.get('/api/blogs')
		const blog = response.body[0]

		const changed = {
			...blog,
			title: "New title for this blog"
		}

		await api
			.put(`/api/blogs/${blog.id}`)
			.send(changed)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await api.get('/api/blogs')
		const updatedBlog = blogsAtEnd.body.find(b => b.id === blog.id)
		assert(updatedBlog) // Check that result is found
		assert.strictEqual(updatedBlog.title, changed.title)
	})

	test('succeeds with updated likes count', async () => {
		const response = await api.get('/api/blogs')
		const blog = response.body[0]

		const changed = {
			...blog,
			likes: blog.likes + 100
		}

		await api
			.put(`/api/blogs/${blog.id}`)
			.send(changed)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await api.get('/api/blogs')
		const updatedBlog = blogsAtEnd.body.find(b => b.id === blog.id)
		assert(updatedBlog) // Check that result is found
		assert.strictEqual(updatedBlog.likes, changed.likes)
	})
})

after(async () => {
	await mongoose.connection.close()
})