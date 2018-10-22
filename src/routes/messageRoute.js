const express = require('express')
const axios = require('axios')
const tunnel = require('tunnel')
const { respondSuccess, respondErr } = require('../utils/responseUtils')
const { messageService } = require('../services')

const BOOT_ID = '5bce2c664d5eae61d4bb6a59'

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

router.get('/old/:sessionId', (req, res) => {
    messageService.selectOld(req.params.sessionId || '')
        .then(result => respondSuccess(res, 200, result))
        .catch(err => respondErr(res, 500, err))
})

router.get('/current/:sessionId', (req, res) => {
    messageService.selectCurrent(req.params.sessionId || '')
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

router.post('/chatbot', async (req, res) => {

    let baseURL = '/';
    let token = '248f1c49d93b4c2c9114d3259e888817';

    const userMessage = await messageService.insert({
        userId: req.body.userId,
        sessionId: req.body.context.sessionId,
        text: req.body.context.query,
        createdAt: new Date(),
    })

    axiosClient.post(baseURL, req.body.context, { headers: { Authorization: `Bearer ${token}` } }).then(async response => {
        const systemMessage = await messageService.insert({
            userId: BOOT_ID,
            sessionId: response.data.sessionId,
            text: response.data.result.fulfillment.messages[0].speech,
            createdAt: new Date(),
        })
        respondSuccess(res, 200, { context: response.data, messages: [systemMessage, userMessage] })
    }).catch(err => respondErr(res, 500, err))
})

exports = module.exports = router