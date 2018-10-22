const express = require('express')
const authRoute = require('./authRoute')
const messageRoute = require('./messageRoute')

/*
 * Rotas abertas
 */
const oapi = express.Router()
oapi.post('/login', authRoute.login)
oapi.post('/validateToken', authRoute.validateToken)
oapi.post('/signup', authRoute.save)

/**
 * Rotas seguras
 */
const api = express.Router()
//api.use(authRoute.auth)
api.use('/messages', messageRoute)

module.exports = { oapi, api }