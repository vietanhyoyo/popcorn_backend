const Class = require('../models/Class');
const SchoolYear = require('../models/SchoolYear');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const jwt = require("jsonwebtoken");

class ClassController {

    getSchoolYear(req, res) {
        SchoolYear.find({}).sort({ name: -1 }).exec((err, doc) => {
            if (err) res.send(err);
            else res.send(doc)
        })

    }

    getClassById(req, res) {
        if (!req.body) res.sendStatus(400);
        else Class.findById(req.body.id).exec((err, doc) => {
            if (err) res.send(err);
            else res.send(doc)
        })
    }

    addSchoolYear(req, res) {
        if (!req.body.name || req.body.name === '') res.sendStatus(401);
        else {
            const name = req.body.name;
            if (name.length > 9) res.send({ message: 'Độ dài không hợp lệ!', status: 'Error' });
            else {
                SchoolYear.create({ name }, function (err, data) {
                    if (err) res.send({ err, status: 'Error' });
                    res.send({ data, status: 'Success' });
                });
            }
        }
    }

    deleteSchoolYear(req, res) {
        if (!req.body.id || req.body.id === '') res.sendStatus(401);
        else {
            SchoolYear.deleteOne({ _id: req.body.id })
                .then(function () {
                    res.send({ status: 'Succes', message: 'Delete school year' });
                }).catch(function (error) {
                    console.log(error);
                });

        }
    }

    async addClass(req, res) {
        if (!req.body) res.sendStatus(401);
        else {
            try {
                const data = req.body;
                const schoolYear = await SchoolYear.findOne({ name: data.schoolYear });
                if (!schoolYear) res.sendStatus(401);
                else {
                    Class.create({
                        name: data.name,
                        schoolYear: schoolYear._id,
                        grade: data.grade
                    }, (err, doc) => {
                        if (err) res.send({ err, status: 'Error' });
                        else {
                            res.send({ status: 'Success', data: doc })
                        }
                    })
                }
            } catch (error) {
                res.send(error);
            }
        }
    }

    async getClassListByYear(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const data = req.body;
                const schoolYear = await SchoolYear.findOne({ name: data.schoolYear })
                if (!schoolYear) res.sendStatus(401);
                else {
                    const classList = await Class.find({ schoolYear: schoolYear._id }).sort({ name: 1 });
                    res.send(classList);
                }
            } catch (error) {
                res.send(error);
            }
        }
    }

    deleteClass(req, res) {
        if (!req.body.id || req.body.id === '') res.sendStatus(401);
        else {
            Class.deleteOne({ _id: req.body.id })
                .then(function () {
                    res.send({ status: 'Succes', message: 'Class' });
                }).catch(function (error) {
                    res.send({ status: 'Error', message: 'Lỗi Class' });
                });
        }
    }

    changeClass(req, res) {
        if (!req.body.id || req.body.id === '' || !req.body.name) res.sendStatus(401);
        else {
            const data = req.body;
            Class.updateOne({ _id: data.id }, { name: data.name }, (err, doc) => {
                if (err) res.send({ err, status: 'Error' });
                else res.send({ status: 'Succes', data: doc });
            });
        }
    }

    async getClassListByNewYear(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const schoolYear = await SchoolYear.findOne({}, {}, { sort: { createdAt: -1 } })
                if (!schoolYear) res.sendStatus(422);
                else {
                    const classList = await Class.find({ schoolYear: schoolYear._id }).sort({ name: 1 });
                    res.send(classList);
                }
            } catch (error) {
                res.send(error);
            }
        }
    }

    getHomeroomTeacherOfClass(req, res) {
        // console.log(req.params['classID'])
        if (!req.params.classID) res.sendStatus(400)
        else {
            const classID = req.params.classID;
            Teacher.findOne({ homeroomClass: classID }, (err, doc) => {
                if (err) res.send(err);
                else {
                    console.log(doc)
                    res.send(doc);
                }
            })
        }
    }

    getClassOfStudent(req, res) {
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
                    Student.findOne({ account: data._id })
                        .select('class')
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                };
            });
        }
    }

    getClassObjectOfStudent(req, res) {
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
                    Student.findOne({ account: data._id })
                        .populate({ path: 'class', model: 'Class' })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else {
                                if (doc === "") res.send(doc);
                                else {
                                    res.send(doc.class);
                                }
                            }
                        })
                };
            });
        }
    }

    getHomeroomClassByTeacher(req, res) {
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
                        .populate({ path: 'homeroomClass', model: 'Class' })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else {
                                if (doc === "") res.send(doc);
                                else {
                                    res.send(doc.homeroomClass);
                                }
                            }
                        })
                };
            });
        }
    }

}

module.exports = new ClassController;