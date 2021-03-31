const Ingredient = require('../models/ingredient-model')

createIngredient = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an ingredient',
        })
    }

    console.log(body)
    const ingredient = new Ingredient(body)

    if (!ingredient) {
        return res.status(400).json({ success: false, error: err })
    }

    Ingredient.findOne({ name: req.params.name }, (err, existingIngredient) => {
        if(existingIngredient) { 
            return res.status(409).json({
                error,
                message: 'Ingredient already exists!',
            });
        }

        console.log('Creating ingredient ' + ingredient.name)

        ingredient
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: ingredient._id,
                message: 'Ingredient created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Ingredient not created!',
            })
        })

    }).catch(err => console.log(err))
}

getIngredients = async (req, res) => {
    await Ingredient.find({}, (err, ingredients) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!ingredients.length) {
            return res
                .status(404)
                .json({ success: false, error: `Ingredient not found` })
        }
        return res.status(200).json({ success: true, data: ingredients })
    }).catch(err => console.log(err))
}

module.exports = {
    createIngredient,
    getIngredients
}