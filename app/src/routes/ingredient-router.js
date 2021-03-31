const express = require('express')

const IngredientCtrl = require('../controllers/ingredient-ctrl')

const router = express.Router()

router.post('/ingredient', IngredientCtrl.createIngredient)
router.get('/ingredients', IngredientCtrl.getIngredients)

module.exports = router