const { User } = require('../models')

const findByUsername = name => {
    return User.findOne({ name: name})
}

const insert = async (user) => {
    await User.collection.insertOne(user)
    return user
}

module.exports = { findByUsername, insert }