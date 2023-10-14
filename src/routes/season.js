const experss = require('express')
const route = experss.Router();
const seasonController = require('../app/controllers/SeasonController')

route.get('/', seasonController.getSeasons)
route.post('/add', seasonController.addSeason)
route.post('/update/:id', seasonController.updateSeason)

module.exports = route