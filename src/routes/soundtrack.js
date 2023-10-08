const experss = require('express')
const route = experss.Router();
const soundTrackController = require('../app/controllers/SoundTrackController')

route.get('/', soundTrackController.getSoundTracks)
route.post('/update/:id', soundTrackController.updateSoundTrackById)

module.exports = route