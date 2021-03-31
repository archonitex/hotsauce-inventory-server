const Batch = require('../models/batch-model')
const path = require("path");
var moment = require('moment')
var fs = require('fs')


createBatch = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a batch',
        })
    }

    console.log('here')
    console.log(body)
    
    body.date = moment(body.date, 'DD-MM-YYYY')

    const batch = new Batch(body)

    if (!batch) {
        return res.status(400).json({ success: false, error: err })
    }

    batch
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: batch._id,
                message: 'Batch created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Batch not created!',
            })
        })
}

updateBatch = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Batch.findOne({ _id: req.params.id }, (err, batch) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Batch not found!',
            })
        }
        batch.name = body.name
        batch.date = body.date
        batch
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: batch._id,
                    message: 'Batch updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Match not updated!',
                })
            })
    })
}

deleteBatch = async (req, res) => {
    await Batch.findOneAndDelete({ _id: req.params.id }, (err, batch) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!batch) {
            return res
                .status(404)
                .json({ success: false, error: `Batch not found` })
        }

        return res.status(200).json({ success: true, data: batch })
    }).catch(err => console.log(err))
}

getBatchById = async (req, res) => {
    await Batch.findOne({ _id: req.params.id }, (err, batch) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!batch) {
            return res
                .status(404)
                .json({ success: false, error: `Batch not found` })
        }
        return res.status(200).json({ success: true, data: batch })
    }).catch(err => console.log(err))
}

getBatches = async (req, res) => {
    await Batch.find({}, (err, batches) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!batches.length) {
            return res
                .status(404)
                .json({ success: false, error: `Batch not found` })
        }
        return res.status(200).json({ success: true, data: batches })
    }).catch(err => console.log(err))
}

printBatchById = async (req, res) => {
    await Batch.findOne({ _id: req.params.id }, (err, batch) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!batch) {
            return res
                .status(404)
                .json({ success: false, error: `Batch not found` })
        }

        var templateXml = fs.readFileSync(path.resolve(__dirname, '../dymo-templates/SauceTemplate.label'), 'utf8');
        
        //Customize template with batch info
        templateXml = templateXml.replace("${QRCODE_TEXT}", batch.id);
        templateXml = templateXml.replace("${BATCH_NAME}", batch.name);
        
        var ingredientsString = batch.ingredients.map(function(item) {
            return item.ingredient
          }).join(', ');
          
        //Change the number in here for the line length limit
        var ingredientSplit = ingredientsString.split(/(.{30,}?)(?:,|$)/g).filter(Boolean)
        
        templateXml = templateXml.replace("${INGREDIENTS_1}", ingredientSplit[0] || '');
        templateXml = templateXml.replace("${INGREDIENTS_2}", ingredientSplit[1] || '');
        
        if(ingredientSplit.length > 2){
            templateXml = templateXml.replace("${INGREDIENTS_3}", ingredientsSplit.slice(2, ingredientsSplit.length));
        }else{
            templateXml = templateXml.replace("${INGREDIENTS_3}", "");
        }

        templateXml = templateXml.replace("${DATE}", moment(batch.createdAt).format('ll'));
        
        return res.status(200).json({ success: true, data: templateXml })

    }).catch(err => console.log(err))
}

module.exports = {
    createBatch,
    updateBatch,
    deleteBatch,
    getBatches,
    getBatchById,

    printBatchById,
}