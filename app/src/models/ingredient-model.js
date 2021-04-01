const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Ingredient = new Schema(
    {
        ingredient: { type: String, required: true, index: true, unique: true },
    },
    { timestamps: false },
)

module.exports = mongoose.model('ingredients', Ingredient)