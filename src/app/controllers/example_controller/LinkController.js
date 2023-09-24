const Link = require("../models/Link")
const Teacher = require("../models/Teacher")
const jwt = require("jsonwebtoken")

class LinkController {

    add(req, res) {
        if (!req.body.link) res.send(400);
        else {
            const { link } = req.body
            Link.create(link, (err, doc) => {
                if (err) res.send(err);
                else res.send(doc);
            })
        }
    }

    getLinksByTeacher(req, res) {
        const authorization = req.headers['authorization'];
        if (!authorization) res.sendStatus(401);
        //'Beaer [token]'
        const token = authorization.split(' ')[1];

        if (!token) res.sendStatus(401);
        else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                // console.log(err, data)
                if (err) res.sendStatus(403);
                else {
                    Teacher.findOne({ account: data._id })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else {
                                Link.find({ teacher: doc._id }).sort({ timeCreate: -1 }).exec((e, d) => {
                                    if (e) res.send(e);
                                    else res.send(d);
                                })
                            }
                        })
                };
            });
        }
    }

    deleteById(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const { id } = req.body;
            Link.deleteOne({ _id: id }).exec((err, doc) => {
                if (err) res.send(err);
                else res.send(doc)
            })
        }
    }

    async changeLink(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const { id, teacher } = req.body;
                await Link.updateMany({ teacher }, { status: "off" });
                const result = await Link.updateOne({ _id: id }, { status: "on" });
                res.send(result);
            } catch (error) {
                res.send(error)
            }

        }
    }

}

module.exports = new LinkController;