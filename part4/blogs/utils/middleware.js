const morgan = require('morgan')

morgan.token('body', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)
	}
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

module.exports = { requestLogger }