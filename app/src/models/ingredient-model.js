const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Ingredient = new Schema(
    {
        name: { type: String, required: true, index: true },
    },
    { timestamps: false },
)

module.exports = mongoose.model('ingredients', Ingredient)