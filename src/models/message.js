const mongoose = require('mongoose')
const User = require('./user')

const messageSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true		
	},
	text: {
		type: String,
		required: false
	},
	createdAt: {
		type: Date,
		required: true
	},
	user: {
		type: User.schema,
		required: false
	},
	sent: {
		type: Boolean,
		required: false
	},
	received: {
		type: Boolean,
		required: false
	}
})

module.exports = mongoose.model('message', messageSchema)