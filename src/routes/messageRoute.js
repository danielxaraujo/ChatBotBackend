const express = require('express')
const axios = require('axios')
const tunnel = require('tunnel')
const { respondSuccess, respondErr } = require('../utils/responseUtils')
const { messageService } = require('../services')

const BOOT_ID = 1

const agent = tunnel.httpsOverHttp({
    proxy: {
        host: '127.0.0.1',
        port: 3128,
    },
});

const axiosClient = axios.create({
    baseURL: 'https://api.dialogflow.com/v1/query?v=20150910:443',
    httpsAgent: agent,
    proxy: false,
})

const router = express.Router()

router.get('/', (req, res) => {
    messageService.selectCurrent()
        .then(result => respondSuccess(res, 200, result))
        .catch(err => respondErr(res, 500, err))
})

router.get('/old', (req, res) => {
    messageService.selectOld()
        .then(result => respondSuccess(res, 200, result))
        .catch(err => respondErr(res, 500, err))
})

router.put('/', (req, res) => {
    const { chatId, text, createdFor } = req.body
    messageService.insert({ chatId, text, createdFor, createdAt: new Date() })
        .then(result => respondSuccess(res, 200, result))
        .catch(err => respondErr(res, 500, err))
})

router.delete('/:chatId', (req, res) => {
    messageService.remove(req.params.chatId)
        .then(result => respondSuccess(res, 200, result))
        .catch(err => respondErr(res, 500, err))
})

router.post('/chatbot', (req, res) => {

    let baseURL = '/';
    let token = '248f1c49d93b4c2c9114d3259e888817';

    messageService.insert({
        sessionId: req.body.context.sessionId,
        text: req.body.context.query,
        createdAt: new Date(),
        createdFor: req.body.createdFor
    })

    axiosClient.post(baseURL, req.body.context, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
            messageService.insert({
                sessionId: response.data.sessionId,
                text: response.data.result.fulfillment.messages[0].speech,
                createdAt: new Date(),
                createdFor: BOOT_ID
            })
            respondSuccess(res, 200, response.data)
        })
        .catch(err => respondErr(res, 500, err))
})

exports = module.exports = router