const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Batch = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        heat: { type: Number, required: true},
        ingredients: [ { ingredient: String, quantity: String } ],
        notes: { type: String },
        imageUrl: { type: String },
        stock: { type: Number },
        price: { type: Number }
    },
    { timestamps: true },
)

module.exports = mongoose.model('batches', Batch)