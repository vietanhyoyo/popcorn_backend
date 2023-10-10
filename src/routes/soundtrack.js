const experss = require('express')
const route = experss.Router()
const soundTrackController = require('../app/controllers/SoundTrackController')

route.get('/', soundTrackController.getSoundTracks)
route.post('/add', soundTrackController.addSoundTrack)
route.post('/update/:id', soundTrackController.updateSoundTrackById)

module.exports = route
