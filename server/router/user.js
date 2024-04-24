const {Router} = require('express')
const controller = require('./../controller/user')
const uploader = require('./../middleware/uploader')
const router = Router()

router.route('/:id').get(controller.getOne ).put(controller.update)

router.route('/:id/picture').post( uploader.single('picture') ,controller.setProfile).delete(controller.deleteProfile)


module.exports = router