const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const logger = require('./utils/logger')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { dbName: "blogs" })
	.then(() => {
		logger.info('Connected to MongoDB')
	})
	.catch(err => {
		logger.error('Error connecting to MongoDB:', err.message)
	})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

module.exports = app