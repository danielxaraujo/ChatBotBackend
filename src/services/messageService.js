const moment = require('moment')
const { Message } = require('../models')

const selectCurrent = () => {
    let date = moment().startOf('day').toDate();
    return Message.find({
        createdAt: {
            $gte: date
        }
    }).sort({
        createdAt: -1
    })
}

const selectOld = () => {
    let date = moment().startOf('day').toDate();
    return Message.find({
        createdAt: {
            $lte: date
        }
    }).sort({
        createdAt: -1
    })
}

const insert = message => {
    return Message.create({
        sessionId: message.sessionId,
        text: message.text,
        createdAt: message.createdAt,
        createdFor: message.createdFor
    })
}

const remove = async (sessionId) => {
    return await Message.deleteMany({ sessionId })
}

module.exports = { selectCurrent, selectOld, insert, remove}