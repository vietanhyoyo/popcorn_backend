const experss = require('express')
const route = experss.Router();
const seasonController = require('../app/controllers/SeasonController')

route.get('/', seasonController.getSeasons)

module.exports = route