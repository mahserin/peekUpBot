const express = require('express')

const controller = require('./../controller/pay')

const router = express.Router()

router.route('/:id').post(controller.newPay)



module.exports = router