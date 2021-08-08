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
        videoUrl: { type: String },
        stock: { type: Number },
        price: { type: Number },
        storeDescription: { type: String, default: '' },
        status: { type: Boolean, default: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('batches', Batch)