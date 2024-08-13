const _ = require('lodash')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const likes = blogs.map(blog => blog.likes)
	return likes.reduce((sum, item) => sum + item, 0)
}

const favoriteBlog = (blogs) => {
	return blogs.reduce((fav, curr) => {
		if (!fav.likes || curr.likes > fav.likes) {
			return curr
		} else {
			return fav
		}
	}, {})
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) { return {} }

	const result = _.chain(blogs)
		.groupBy('author')
		.map((list, author) => ({ author, blogs: list.length }))
		.maxBy('blogs')
		.value()

	return result
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) { return {} }

	const totalLikes = (list) => {
		return list.reduce((prev, curr) => prev + curr.likes, 0)
	}

	const result = _.chain(blogs)
		.groupBy('author')
		.map((list, author) => ({ author, likes: totalLikes(list) }))
		.maxBy('likes')
		.value()

	return result
}

module.exports = {
	dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}