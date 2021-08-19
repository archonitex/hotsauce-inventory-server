const express = require('express')

const BatchCtrl = require('../controllers/batch-ctrl')

const router = express.Router()

router.post('/batch', BatchCtrl.createBatch)
router.put('/batch/:id', BatchCtrl.updateBatch)
router.delete('/batch/:id', BatchCtrl.deleteBatch)
router.get('/batch/:id', BatchCtrl.getBatchById)
router.get('/batches', BatchCtrl.getBatches)
router.get('/batches/active', BatchCtrl.getActiveBatches)

router.post('/batches/woocommerce', BatchCtrl.syncNewBatchesWithWooCommerce)
router.put('/batches/woocommerce', BatchCtrl.syncExistingBatchesWithWooCommerce)
router.get('/batches/woocommerce', BatchCtrl.syncLocalBatchesFromWooCommerce)

router.post('/batch/:id/print', BatchCtrl.printBatchById)

router.post('/upload', BatchCtrl.customUpload)

module.exports = router