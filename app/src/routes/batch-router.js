const express = require('express')

const BatchCtrl = require('../controllers/batch-ctrl')

const router = express.Router()

router.post('/batch', BatchCtrl.createBatch)
router.put('/batch/:id', BatchCtrl.updateBatch)
router.delete('/batch/:id', BatchCtrl.deleteBatch)
router.get('/batch/:id', BatchCtrl.getBatchById)
router.get('/batches', BatchCtrl.getBatches)

router.post('/batch/:id/print', BatchCtrl.printBatchById)

module.exports = router