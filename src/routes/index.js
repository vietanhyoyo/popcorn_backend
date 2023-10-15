const filmRouter = require("./film")
const seasonRouter = require("./season");
const episodeRouter = require("./episode");
const soundTrackRouter = require("./soundtrack")
const siteRouter = require("./site")
const convertRouter = require("./convert");

function route(app) {

    app.use('/episode', episodeRouter);
    app.use('/season', seasonRouter);
    app.use('/soundtrack', soundTrackRouter);
    app.use('/film', filmRouter);
    app.use('/convert', convertRouter);
    app.use('/', siteRouter);

}

module.exports = route;