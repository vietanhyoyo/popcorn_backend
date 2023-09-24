const Question = require('../models/Question')
const jwt = require("jsonwebtoken")

class QuestionController {

    add(req, res) {
        if (!req.body) {
            res.sendStatus(400);
        }
        else {
            try {
                const data = req.body;
                Question.create(data, (err, doc) => {
                    if (err) res.send(err);
                    else res.send(doc)
                })
            } catch (error) {
                res.send(error);
            }
        }
    }

    getAll(req, res) {
        if (!req.params) {
            res.sendStatus(400);
        }
        else {
            const { idLesson } = req.params;
            Question.find({ lesson: idLesson }, (err, docs) => {
                if (err) res.send(err);
                else {
                    res.send(docs);
                }
            })
        }
    }

    delete(req, res) {
        if (!req.params) {
            res.sendStatus(400);
        }
        else {
            const { idQuestion } = req.params;
            Question.deleteOne({ _id: idQuestion }, (err, docs) => {
                if (err) res.send(err);
                else {
                    res.send(docs);
                }
            })
        }
    }

    getQuestionTest(req, res) {
        if (!req.params) {
            res.sendStatus(400);
        }
        else {
            const { idLesson } = req.params;
            Question.find({ lesson: idLesson }, (err, doc) => {
                if (err) res.send(err);
                else {
                    if (doc.length === 0) {
                        res.send({ status: false, data: doc })
                    }
                    else {
                        res.send({ status: true, data: doc })
                    }
                }
            })
        }
    }

}

module.exports = new QuestionController;