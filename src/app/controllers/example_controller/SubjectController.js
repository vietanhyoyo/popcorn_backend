const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const jwt = require("jsonwebtoken")

class SubjectController {

    getSubjects(req, res) {
        Subject.find({}, (err, doc) => {
            if (err) res.send(err);
            else res.send(doc);
        })
    }

    async getSubjectGrade(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const grade = req.body.grade;
            switch(grade){
                case '1': {
                    const foundGrade = await Grade.findOne({ name: '1' });
                    res.send({ status: "Success", data: foundGrade.subjects });
                    break;
                }
                case '2': {
                    const foundGrade = await Grade.findOne({ name: '2' });
                    res.send({ status: "Success", data: foundGrade.subjects });
                    break;
                }
                case '3': {
                    const foundGrade = await Grade.findOne({ name: '3' });
                    res.send({ status: "Success", data: foundGrade.subjects });
                    break;
                }
                case '4': {
                    const foundGrade = await Grade.findOne({ name: '4' });
                    res.send({ status: "Success", data: foundGrade.subjects });
                    break;
                }
                case '5': {
                    const foundGrade = await Grade.findOne({ name: '5' });
                    res.send({ status: "Success", data: foundGrade.subjects });
                    break;
                }
                default: {
                    res.send({ status: "Error", message: "Lỗi không đúng khối" });
                }
            }
        }
    }

    getSubjectsByTeacher(req, res) {
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
                        .populate({ path: 'subjects', model: 'Subject' })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else {
                                res.send(doc.subjects);
                            }
                        })
                };
            });
        }
    }

}

module.exports = new SubjectController;