const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const errorHandler = (error, req, res, next) => {
	logger.error(error.message)
	if (error.name === 'CastError') {
		return res.status(400).json({ error: 'Malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error })
	}
	next(error)
}

module.exports = { errorHandler, requestLogger }