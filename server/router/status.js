const express = require('express')

const controller = require('../controller/status')

const router = express.Router()

router.route('/:id').get(controller.getOne)



module.exports = router