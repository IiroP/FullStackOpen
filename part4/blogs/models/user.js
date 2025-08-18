const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: String,
	name: String,
	passwordHash: String
})

userSchema.set('toJSON', {
	transform: (doc, obj) => {
		obj.id = obj._id.toString()
		delete obj._id
		delete obj.__v
		delete obj.passwordHash // do not reveal hash
	}
})

module.exports = mongoose.model('User', userSchema)