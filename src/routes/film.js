const experss = require('express')
const route = experss.Router()
const filmController = require('../app/controllers/FilmController')

route.get('/id', filmController.getFilmByID)
route.post('/add', filmController.addFilm)
route.get('/banner', filmController.getBannerFilms)
route.get('/new', filmController.getNewFilms)
route.get('/popular', filmController.getPopularFilms)
route.get('/slug', filmController.getFilmBySlug)
route.post('/update/:id', filmController.updateFilm)
route.post('/delete/:id', filmController.deleteFilm)
route.get('/', filmController.getFilmList)

module.exports = route
