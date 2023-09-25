const experss = require('express')
const route = experss.Router();
const convertController = require('../app/controllers/convert_db/ConvertController')

route.get('/type', convertController.convertType)
route.get('/film', convertController.convertFilm)
route.get('/episode', convertController.convertEpisode)
route.get('/season', convertController.convertSeason)
route.get('/soundtrack', convertController.convertSoundTrack)

module.exports = route