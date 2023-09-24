const siteRouter = require("./site")
const convertRouter = require("./convert");

function route(app) {

    app.use('/convert', convertRouter);
    app.use('/', siteRouter);

}

module.exports = route;