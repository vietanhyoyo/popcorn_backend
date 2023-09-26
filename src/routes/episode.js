const experss = require('express')
const route = experss.Router();
const episodeController = require('../app/controllers/EpisodeController')

route.get('/', episodeController.getEpisodes)

module.exports = route