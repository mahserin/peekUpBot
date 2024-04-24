const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/profiles')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      if(!['.jpg' , '.png' , '.webp'].includes(path.extname(file.originalname))) cb('file format is invalid',null)
      cb(null, path.basename(file.originalname) + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload