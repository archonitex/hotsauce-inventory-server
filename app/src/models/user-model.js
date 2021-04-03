const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        username: { type: String, required: true, index: true, unique: true },
        password: { type: String, required: true},
        permissions: [String]
    },
    { timestamps: false },
)

module.exports = mongoose.model('users', User)