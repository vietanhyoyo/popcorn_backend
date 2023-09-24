const experss = require('express')
const route = experss.Router();
const convertController = require('../app/controllers/convert_db/ConvertController')

route.get('/type', convertController.convertType)

module.exports = route