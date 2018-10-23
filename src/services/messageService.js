const moment = require('moment')
const userService = require('./userService')
const { Message } = require('../models')

const selectCurrent = sessionId => {
    let date = moment().startOf('day').toDate()
    return Message.find({
        sessionId,
        createdAt: {
            $gte: date
        }
    }).sort({
        createdAt: -1
    })
}

const selectOld = sessionId => {
    let date = moment().startOf('day').toDate()
    return Message.find({
        sessionId,
        createdAt: {
            $lte: date
        }
    }).sort({
        createdAt: -1
    })
}

const insert = async message => {
    const user = await userService.findById(message.userId)
    return Message.create({
        sessionId: message.sessionId,
        text: message.text,
        createdAt: message.createdAt,
        user: user,
        sent: true,
        received: true
    })
}

const remove = async (sessionId) => {
    return await Message.deleteMany({ sessionId })
}

module.exports = { selectCurrent, selectOld, insert, remove }