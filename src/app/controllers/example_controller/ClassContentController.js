const Class = require('../models/Class');
const ClassContent = require('../models/ClassContent')
const SchoolYear = require('../models/SchoolYear');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const jwt = require("jsonwebtoken");

class ClassContentController {

    home(req, res) {
        res.send('Hello home');
    }

    addClassContent(req, res) {
        if (!req.body) return res.sendStatus(400);
        else {
            const content = req.body;
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
                        Teacher.findOne({ account: data._id }, (error, doc) => {
                            if (error) res.send(error)
                            else
                                ClassContent.create({
                                    ...content,
                                    teacher: doc._id
                                }, (e, d) => {
                                    if (e) res.send(e);
                                    else res.send(d);
                                })
                        })
                    };
                });
            }
        }
    }

    getClassContentList(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const classID = req.body.classID;
            ClassContent.find({ class: classID }).sort({ date: -1 }).exec((err, docs) => {
                if (err) res.send(err);
                else res.send(docs)
            })
        }
    }

    getById(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const { id } = req.body;
            ClassContent.findById(id, (err, doc) => {
                if (err) res.send(err);
                else res.send(doc)
            })
        }
    }

    updateClassContent(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const data = req.body;
            ClassContent.updateOne({ _id: data.content._id }, data.content, (err, doc) => {
                if (err) res.send(err);
                else {
                    res.send(doc);
                }
            })
        }
    }

    deleteClassContent(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const { id } = req.body;
            ClassContent.deleteOne({ _id: id }, (err, doc) => {
                if (err) res.send(err);
                else {
                    res.send(doc);
                }
            })
        }
    }

}

module.exports = new ClassContentController;