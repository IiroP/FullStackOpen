const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
	test('returns one', () => {
		const blogs = []

		const result = listHelper.dummy(blogs)
		assert.strictEqual(result, 1)
	})
})

describe('total likes', () => {
	test('of empty list is zero', () => {
		const blogs = []
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, 0)
	})

	test('of one blog equals likes of that blog', () => {
		const blogs = [
			{
				title: 'Something',
				author: 'Someone',
				url: 'https://google.com',
				likes: 10,
				id: '66b7a1f38434990cadcb7f60'
			}
		]
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, blogs[0].likes)
	})

	test('of multiple blogs is calculated correctly', () => {
		const blogs = [
			{
				title: 'Sample blog',
				author: 'Not me',
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: 'Author Name',
				url: 'https://example.com',
				likes: 50,
				id: '1234567'
			},
			{
				title: 'Tech Trends',
				author: 'Tech Guru',
				url: 'https://techexample.com',
				likes: 75,
				id: '2345678'
			},
			{
				title: 'Cooking 101',
				author: 'Chef Master',
				url: 'https://cookingblog.com',
				likes: 20,
				id: '3456789'
			},
		]
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, 245)
	})
})

describe('favorite blog', () => {
	test('of empty list is empty', () => {
		const blogs = []
		const result = listHelper.favoriteBlog(blogs)
		assert.deepStrictEqual(result, {})
	})

	test('of one blog equals that blog', () => {
		const blogs = [
			{
				title: 'Something',
				author: 'Someone',
				url: 'https://google.com',
				likes: 10,
				id: '66b7a1f38434990cadcb7f60'
			}
		]
		const result = listHelper.favoriteBlog(blogs)
		assert.deepStrictEqual(result, blogs[0])
	})

	test('of multiple blogs (with different likes) is correct', () => {
		const favorite = {
			title: 'Tech Trends',
			author: 'Tech Guru',
			url: 'https://techexample.com',
			likes: 750,
			id: '2345678'
		}
		const blogs = [
			{
				title: 'Sample blog',
				author: 'Not me',
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: 'Author Name',
				url: 'https://example.com',
				likes: 50,
				id: '1234567'
			},
			favorite,
			{
				title: 'Cooking 101',
				author: 'Chef Master',
				url: 'https://cookingblog.com',
				likes: 20,
				id: '3456789'
			},
		]
		const result = listHelper.favoriteBlog(blogs)
		assert.deepStrictEqual(result, favorite)
	})

	test('of multiple blogs (with multiple favorites) is correct', () => {
		const maxLikes = 1000
		const blogs = [
			{
				title: 'Sample blog',
				author: 'Not me',
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: 'Author Name',
				url: 'https://example.com',
				likes: maxLikes,
				id: '1234567'
			},
			{
				title: 'Cooking 101',
				author: 'Chef Master',
				url: 'https://cookingblog.com',
				likes: maxLikes,
				id: '3456789'
			},
		]
		const result = listHelper.favoriteBlog(blogs)
		assert.strictEqual(result.likes, maxLikes)
	})
})

describe('most blogs', () => {
	test('of empty list should be empty', () => {
		const blogs = []
		const result = listHelper.mostBlogs(blogs)
		assert.deepStrictEqual(result, {})
	})

	test('of one blog is correct', () => {
		const author = 'Someone'
		const expected = {
			author,
			blogs: 1
		}
		const blogs = [
			{
				title: 'Something',
				author,
				url: 'https://google.com',
				likes: 10,
				id: '66b7a1f38434990cadcb7f60'
			}
		]
		const result = listHelper.mostBlogs(blogs)
		assert.deepStrictEqual(result, expected)
	})

	test('of multiple blogs is correct', () => {
		const author = 'Someone'
		const expected = {
			author,
			blogs: 2
		}
		const blogs = [
			{
				title: 'Sample blog',
				author: 'Not me',
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: author,
				url: 'https://example.com',
				likes: 213,
				id: '1234567'
			},
			{
				title: 'Cooking 101',
				author: author,
				url: 'https://cookingblog.com',
				likes: 123,
				id: '3456789'
			},
		]
		const result = listHelper.mostBlogs(blogs)
		assert.deepStrictEqual(result, expected)
	})

	test('works correctly on ties', () => {
		const authors = ['Not me', 'Someone']
		const blogs = [
			{
				title: 'Sample blog',
				author: authors[0],
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: authors[1],
				url: 'https://example.com',
				likes: 213,
				id: '1234567'
			},
		]
		const result = listHelper.mostBlogs(blogs)
		assert.strictEqual(result.blogs, 1)
		assert(authors.includes(result.author))
	})
})

describe('most likes', () => {
	test('of empty list should be empty', () => {
		const blogs = []
		const result = listHelper.mostLikes(blogs)
		assert.deepStrictEqual(result, {})
	})

	test('of one blog is correct', () => {
		const author = 'Someone'
		const likes = 10
		const expected = {
			author,
			likes
		}
		const blogs = [
			{
				title: 'Something',
				author,
				url: 'https://google.com',
				likes,
				id: '66b7a1f38434990cadcb7f60'
			}
		]
		const result = listHelper.mostLikes(blogs)
		assert.deepStrictEqual(result, expected)
	})

	test('of multiple blogs is correct', () => {
		const author = 'Someone'
		const expected = {
			author,
			likes: 336
		}
		const blogs = [
			{
				title: 'Sample blog',
				author: 'Not me',
				url: 'https://fullstackopen.com',
				likes: 100,
				id: '1521393'
			},
			{
				title: 'Another blog',
				author: author,
				url: 'https://example.com',
				likes: 213,
				id: '1234567'
			},
			{
				title: 'Cooking 101',
				author: author,
				url: 'https://cookingblog.com',
				likes: 123,
				id: '3456789'
			},
		]
		const result = listHelper.mostLikes(blogs)
		assert.deepStrictEqual(result, expected)
	})
})