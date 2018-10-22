const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const queryParser = require('express-query-int')
const bodyParser = require('body-parser')
const allowCors = require('cors')
const express = require('express')
const server = express()

const routes = require('./routes')

server.use(allowCors())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(queryParser())

server.use('/', routes.oapi)
server.use('/api', routes.api)

const port = process.env.PORT || 3001
server.listen(port, () => {
	console.log(`BACKEND is running on port ${port}.`)
	mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }).then(() => {
		console.log('DATABASE is running!!!')
	})
})

module.exports = server
