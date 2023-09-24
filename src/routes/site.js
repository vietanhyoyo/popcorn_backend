const experss = require('express')
const route = experss.Router();
const siteController = require('../app/controllers/SiteController')

route.get('/', siteController.index)

module.exports = route