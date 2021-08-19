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
        storeId: { type: Number }
    },
    { timestamps: true },
)

Batch.methods.toWooCommerceProduct = function() {
    var wooProduct = {
        name: this.name,
        type: "simple",
        price: this.price.toString(),
        regular_price: this.price.toString(),
        description: this.storeDescription,
        short_description: this.ingredients.map(function(item) { return item.ingredient }).join(', '),
        sku: this.id,
        purchasable: true,
        manage_stock: true,
        stock_quantity: this.stock,
        stock_status: this.stock > 0 ? "instock" : "outofstock",
        status: 'publish',
        catalog_visibility: 'visible',
      }
    
    if(this.storeId) wooProduct.id = this.storeId

    return wooProduct
};

module.exports = mongoose.model('batches', Batch)