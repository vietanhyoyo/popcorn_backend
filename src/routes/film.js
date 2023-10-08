const experss = require('express')
const route = experss.Router()
const filmController = require('../app/controllers/FilmController')

route.get('/id', filmController.getFilmByID)
route.post('/add', filmController.addFilm)
route.get('/slug', filmController.getFilmBySlug)
route.get('/search', filmController.getSearchFilm)
route.post('/update/:id', filmController.updateFilm)
route.get('/', filmController.getFilmList)

module.exports = route
