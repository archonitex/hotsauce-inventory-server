const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const Batch = require('../models/batch-model')
const path = require("path");
var moment = require('moment')
var multer = require('multer')
var fs = require('fs')
var wrap = require('word-wrap');

const wooApi = new WooCommerceRestApi({
    url: "https://www.volamtar.com",
    consumerKey: "ck_d9591d96ba857d2cb5663cdb3ba7a7dd349226fc",
    consumerSecret: "cs_af143364fa5cf9cb072a6f31abffbb0f9924416e",
    version: "wc/v3",
    queryStringAuth: true
  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

multerUpload = multer({ storage: storage }).single('file')

customUpload = (req, res) => {
    multerUpload(req,res,function(err) {
        if(err) {
            return res.status(400).json({
                err,
                message: 'File not uploaded!',
            })
        }

        res.status(201).json({
            success: true,
        })
    });
}

createBatch = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a batch',
        })
    }

    //Check for image
    if(body.imageName){
        body.imageUrl = '//volamtarpeppers.wrclan.ca:5100/images/' + body.imageName
        delete body.imageName
    }

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

        //Check for image
        if(body.imageName){
            body.imageUrl = '//volamtarpeppers.wrclan.ca:5100/images/' + body.imageName
            delete body.imageName
        } else {
            body.imageUrl = batch.imageUrl
        }

        batch.name = body.name
        batch.notes = body.notes
        batch.heat = body.heat
        batch.ingredients = body.ingredients
        batch.stock = body.stock
        batch.price = body.price
        batch.status = body.status
        batch.imageUrl = body.imageUrl
        batch.videoUrl = body.videoUrl
        batch.storeDescription = body.storeDescription;

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

getActiveBatches = async (req, res) => {
    await Batch.find({status: true}, (err, batches) => {
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

        const copies = req.body.copies;
        const pathToGLabel = path.resolve(__dirname, '../dymo-templates')
        
        var templateXml = fs.readFileSync(pathToGLabel + '/template-details.glabels', 'utf8');
        
        //Customize template with batch info
        templateXml = templateXml.replace("VV_BATCH_ID_VV", batch.id);
        templateXml = templateXml.replace("VV_BATCH_NAME_VV", batch.name);
        templateXml = templateXml.replace("VV_DATE_VV", moment(batch.createdAt).format('ll'));
        
        var ingredientsString = batch.ingredients.map(function(item) {
            return item.ingredient
          }).join(', ');
        ingredientsString = wrap(ingredientsString, {width: 35});
        templateXml = templateXml.replace("VV_INGREDIENTS_VV", ingredientsString);
        
        const maxHeightValue = 61;
        var heatBarHeight = (batch.heat / 100) * maxHeightValue;
        templateXml = templateXml.replace("VV_HEAT_VV", heatBarHeight.toString());

        //Create temporary file
        const templateFilePath = pathToGLabel + '/' + batch.id + '.glabels';
        const templatePDFFilePath = pathToGLabel + '/' + batch.id + '.pdf';
        fs.writeFileSync(templateFilePath, templateXml); 

        //Execute
        const { exec } = require('child_process');
        const env = {uid: 1000, env:{'DISPLAY': ':0'}}

        exec('glabels-3-batch ' + templateFilePath + ' -o ' + templatePDFFilePath, env, (err, stdout, stderr) => {
            fs.unlinkSync(templateFilePath)
            if (err) {
                return res
                .status(500)
                .json({ success: false, env: env, error: err, stderr: stderr, stdout: stdout })
            }

            for(var i=0; i < copies; i++){
                exec('lpr ' + templatePDFFilePath, env, (lprErr, lprStdout, lprStderr) => {})
            }

            //Delete the file in 2 minutes
            setTimeout(() => { fs.unlinkSync(templatePDFFilePath) }, 120000)

            return res.status(200).json({ success: true, data: templateXml })
        });
        
        //Print the logo label
        const logoFilePath = pathToGLabel + '/template-logo.glabels';
        const logoPDFFilePath = pathToGLabel + '/logo.pdf';
        
        if(!fs.existsSync(logoFilePath)){
            exec('glabels-3-batch ' + logoFilePath + ' -o ' + logoPDFFilePath, env, (err, stdout, stderr) => {
                for(var i=0; i < copies; i++){
                    exec('lpr ' + logoPDFFilePath, env, (lprErr, lprStdout, lprStderr) => {})
                }
            });
        }else{
            for(var i=0; i < copies; i++){
                exec('lpr ' + logoPDFFilePath, env, (lprErr, lprStdout, lprStderr) => {})
            }
        }
        
    }).catch(err => console.log(err))
}

syncNewBatchesWithWooCommerce = async (req, res) => { 
    await Batch.find({ storeId: null, status: true }, (err, batches) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }else if (!batches.length) {
            return res.status(204).json({ success: true, data: [] })
        }

        var createBatch = {"create": []}
        batches.forEach(batch => { 
            createBatch.create.push(batch.toWooCommerceProduct())
        })

        wooApi.post("products/batch", createBatch)
            .then((response) => {
                let wooProducts = response.data.create

                console.log('Response from batch')
                console.log(response.data)

                wooProducts.forEach(wooproduct => {
                    Batch.findOne({ _id: wooproduct.sku }, (err, batch) => {
                        if(!batch) return;
                        batch.storeId = wooproduct.id

                        console.log("Updating local batch from newly created item in WooCommerce.")
                        
                        batch
                            .save()
                            .catch(error => {
                                console.log("Error updating batch from WooCommerce: " + error)
                            })
                    })
                });
            })
            .catch((error) => {
                // Invalid request, for 4xx and 5xx statuses
                console.log("Invalid WooCommerce Request.")
                console.log("Response Status:", error.response.status);
                console.log(error.response)
              })

        return res.status(200).json({ success: true })
    }).catch(err => console.log(err))
    
}

syncExistingBatchesWithWooCommerce = async (req, res) => {
    await Batch.find({ storeId: { $ne: null } }, (err, batches) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }else if (!batches.length) {
            return res.status(204).json({ success: true, data: [] })
        }

        var updateBatch = {"update": []}
        batches.forEach(batch => { 
            updateBatch.update.push(batch.toWooCommerceProduct())
        })

        wooApi.post("products/batch", updateBatch)
            .catch((error) => {
                // Invalid request, for 4xx and 5xx statuses
                console.log("Invalid WooCommerce Request.")
                console.log("Response Status:", error.response.status);
                console.log(error.response)
              })

        return res.status(200).json({ success: true })
    }).catch(err => console.log(err))
}


syncLocalBatchesFromWooCommerce = async (req, res) => {

    var fetchProducts = async(page, cb) => {
        wooApi.get("products", {
            per_page: 20,
            page: page
          })
            .then((response) => {
                let wooProducts = response.data
                console.log(response)
    
                wooProducts.forEach(wooproduct => {
                    Batch.findOne({ _id: wooproduct.sku }, (err, batch) => {
                        if(!batch) return;
                        
                        //Update stock, price, sku, storeId
                        batch.stock = wooproduct.stock_quantity
                        batch.price = parseInt(wooproduct.price)
                        batch.storeId = wooproduct.id
    
                        if(wooproduct.images && wooproduct.images.length > 0){
                            batch.imageUrl = wooproduct.images[0].src
                        }
                
                        batch
                            .save()
                            .catch(error => {
                                console.log("Error updating batch from WooCommerce: " + error)
                            })
                    })
                });

                let totalPages = parseInt(response.headers['x-wp-totalpages'])
                let nextPage = (page || 1) + 1
                cb(totalPages > nextPage ? nextPage : undefined )
            })
            .catch((error) => {
              // Invalid request, for 4xx and 5xx statuses
              console.log("Invalid WooCommerce Request.")
              console.log("Response Status:", error.response.status);
              return res.status(error.response.status).json({ success: false })
            })
    }

    var fetchCb;
    fetchCb = function(nextPage){
        if(nextPage){
            fetchProducts(nextPage, fetchCb)
        }else{
            return res.status(200).json({ success: true })
        }
    }

    //No page specified, start from start
    fetchProducts(undefined, fetchCb) 
}


module.exports = {
    createBatch,
    customUpload,
    updateBatch,
    deleteBatch,
    getBatches,
    getActiveBatches,
    getBatchById,

    printBatchById,

    syncNewBatchesWithWooCommerce,
    syncExistingBatchesWithWooCommerce,
    syncLocalBatchesFromWooCommerce,
}
