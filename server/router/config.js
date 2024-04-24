const express = require('express')

const controller = require('./../controller/config')

const router = express.Router()

router.route('/:id').put(controller.setConfig)



module.exports = router