const { User } = require('../models')

const findById = id => {
    return User.findById(id)
}

const findByUsername = name => {
    return User.findOne({ name: name})
}

const insert = async (user) => {
    await User.collection.insertOne(user)
    return user
}

module.exports = { findById, findByUsername, insert }