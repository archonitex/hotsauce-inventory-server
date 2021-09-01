const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Batch = new Schema(
    {
        name: { type: String, required: true },
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
     //Heat
    var heatString = ''
    let numberOfPeppers = Math.round(parseFloat(this.heat/20))
    for (var i=0; i < numberOfPeppers; i++) {
        heatString += "🌶️"
    }
    
    var shortDescription = heatString + "\n" + this.storeDescription

    var wooProduct = {
        name: this.name,
        type: "simple",
        price: this.price.toString(),
        regular_price: this.price.toString(),
        description: "Ingredients: " + this.ingredients.map(function(item) { return item.ingredient }).join(', '),
        short_description: shortDescription,
        sku: this.id,
        purchasable: true,
        manage_stock: true,
        stock_quantity: this.stock,
        stock_status: this.stock > 0 ? "instock" : "outofstock",
        status: this.status == true ? 'publish' : 'draft',
        post_status: this.status == true ? 'publish' : 'draft',
      }
    
    if(this.storeId) wooProduct.id = this.storeId

    return wooProduct
};

module.exports = mongoose.model('batches', Batch)