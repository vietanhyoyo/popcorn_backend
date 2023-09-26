const experss = require('express')
const route = experss.Router();
const filmController = require('../app/controllers/FilmController')

route.get('/slug', filmController.getFilmBySlug)
route.get('/', filmController.getFilmList)

module.exports = route