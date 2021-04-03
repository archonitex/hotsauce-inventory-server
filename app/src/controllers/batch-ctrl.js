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

    //Fix date format
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
        //Fix date format
        body.date = moment(body.date, 'DD-MM-YYYY')

        batch.name = body.name
        batch.date = body.date
        batch.notes = body.notes
        batch.heat = body.heat
        batch.ingredients = body.ingredients
        batch.stock = body.stock
        batch.price = body.price
        batch.imageUrl = body.imageUrl

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
                .status(204)
                .json({ success: true, data: [] })
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

        const pathToGLabel = path.resolve(__dirname, '../dymo-templates')
        
        var templateXml = fs.readFileSync(pathToGLabel + '/template.glabels', 'utf8');
        
        //Customize template with batch info
        templateXml = templateXml.replace("${BATCH_ID}", batch.id);
        templateXml = templateXml.replace("${BATCH_NAME}", batch.name);
        templateXml = templateXml.replace("${DATE}", moment(batch.createdAt).format('ll'));
        
        var ingredientsString = batch.ingredients.map(function(item) {
            return item.ingredient
          }).join(', ');
        templateXml = templateXml.replace("${INGREDIENTS}", ingredientsString);
        
        const maxHeightValue = 61;
        var heatBarHeight = (batch.heat / 100) * maxHeightValue;
        templateXml = templateXml.replace("${HEAT_BAR_HEIGHT}", heatBarHeight.toString());

        //Create temporary file
        const templateFilePath = pathToGLabel + '/' + batch.id + '.glabels';
        fs.writeFileSync(templateFilePath, templateXml); 

        //Execute
        const { exec } = require('child_process');
        exec('(cd ' + pathToGLabel + ' ; ./glabels-batch-qt ' + templateFilePath + ' -c ' + req.body.copies + ')', (err, stdout, stderr) => {
            fs.unlinkSync(templateFilePath)
            if (err) {
                return res
                .status(500)
                .json({ success: false, error: err })
            } else {
                return res.status(200).json({ success: true, data: templateXml })
            }
        });
        
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