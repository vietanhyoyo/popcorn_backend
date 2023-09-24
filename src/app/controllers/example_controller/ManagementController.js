const jwt = require("jsonwebtoken")
const Management = require("../models/Management")

class ManagementController {

    add(req, res) {
        Management.create({
            code: 'main',
            learnStatus: 'online'
        }, (err, doc) => {
            if (err) res.send(err);
            else res.send(doc)
        })
    }

    get(req, res) {
        Management.findOne({ code: 'main' }, (err, doc) => {
            if (err) res.send(err)
            else res.send(doc);
        });
    }

    change(req, res) {
        if (!req.body) res.sendStatus(400)
        else {
            const { status } = req.body;
            const learnStatus = status ? "online" : "offline";
            Management.updateOne({ code: "main" }, { learnStatus }, (err, doc) => {
                if (err) res.send(err)
                else res.send(doc);
            });
        }
    }

}

module.exports = new ManagementController;