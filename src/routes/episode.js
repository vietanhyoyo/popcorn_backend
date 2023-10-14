const experss = require('express')
const route = experss.Router();
const episodeController = require('../app/controllers/EpisodeController')

route.get('/', episodeController.getEpisodes)
route.post('/update/:id', episodeController.updateEpisode)
route.post('/add', episodeController.addEpisode)

module.exports = route