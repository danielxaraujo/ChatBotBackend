const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true		
	},
	text: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true
	},
	createdFor: {
		type: String,
		required: false
	}
})

module.exports = mongoose.model('message', messageSchema)