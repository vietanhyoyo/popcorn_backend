const bcrypt = require('bcrypt-nodejs');
const Account = require('../models/Account');
const Teacher = require('../models/Teacher');
const jwt = require("jsonwebtoken")

class TeacherController {

    async addTeacher(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            const data = req.body;
            // const classInCharge = data.classInCharge;
            // if (data.homeroomTeacher && classInCharge.length === 0) {
            //     classInCharge.push(data.homeroomClass);
            // }
            const availableAccount = await Account.findOne({ username: data.username })
            if (availableAccount) res.send({ status: 'Error', message: 'Tên đăng nhập đã được sử dụng!' });
            else {
                try {
                    const newPass = await bcrypt.hashSync(data.password, bcrypt.genSaltSync(5), null);
                    const newAccount = await Account.create({
                        username: data.username,
                        password: newPass,
                        name: data.name,
                        role: 1
                    })
                    const newTeacher = await Teacher.create({
                        account: newAccount._id,
                        name: data.name,
                        ethnic: data.ethnic,
                        birthday: data.birthday,
                        identityCard: data.identityCard,
                        homeTown: data.homeTown,
                        residence: data.residence,
                        phone: data.phone,
                        email: data.email,
                        avatar: data.avatar,
                        subjects: data.subjects,
                        position: data.position,
                        socialInsurance: data.socialInsurance,
                        homeroomClass: data.homeroomClass,
                        homeroomTeacher: data.homeroomTeacher,
                        classInCharge: data.classInCharge,
                        sex: data.sex
                    })
                    res.send({ status: 'Success', data: newTeacher, message: 'Tạo thành công giáo viên mới!' })
                } catch (error) {
                    res.send({ status: 'Error', message: 'Lỗi khi tạo tài khoản!', error });
                }
            }
        }
    }

    async getAllTeacher(req, res) {
        const teachers = await Teacher.find({ isDelete: false })
            .populate({ path: 'account', model: 'Account' })
            .populate({ path: 'homeroomClass', model: 'Class' })
        res.send(teachers);
    }

    async deleteTeacher(req, res) {
        if (!req.body.idTeacher || !req.body.idAccount) res.sendStatus(400);
        else {
            try {
                await Teacher.deleteOne({ _id: req.body.idTeacher });
                await Account.deleteOne({ _id: req.body.idAccount });
                res.send({ status: 'Success', message: 'Xóa thành công!' })
            } catch (error) {
                res.send({ status: 'Error', message: 'Lỗi khi xóa!', error })
            }
        }
    }

    getTeacherById(req, res) {
        if (!req.body.id) res.sendStatus(400);
        else {
            Teacher.findById(req.body.id)
                .populate({ path: 'account', model: 'Account' })
                .exec((error, doc) => {
                    if (error) res.send({ status: 'Error', message: 'Lỗi khi tìm dữ liệu', error });
                    else res.send({ status: 'Success', data: doc });
                })
        }
    }

    async updateTeacher(req, res) {
        try {
            if (!req.body) res.sendStatus(400);
            else {
                const accountData = req.body.account;
                let teacherData = req.body.teacher;
                teacherData = {
                    ...teacherData,
                    name: accountData.name
                }

                await Account.updateOne({ _id: accountData._id }, accountData);
                await Teacher.updateOne({ _id: teacherData._id }, teacherData);

                res.send({ status: 'Success', accountData, teacherData });
            }
        } catch (error) {
            res.send({ status: 'Error', message: 'Lỗi trong cập nhật', error });
        }
    }

    async getTeacherBySubject(req, res) {
        if (!req.body) {
            res.sendStatus(400);
        }
        else {
            try {
                const subjectID = req.body.id;
                const classID = req.body.classID;
                const data = await Teacher
                    .find({
                        $or: [
                            // { 'subjects': subjectID, 'homeroomTeacher': false },
                            // { 'subjects': subjectID, 'homeroomClass': classID },
                            { 'subjects': subjectID, 'classInCharge': classID }
                        ]
                    })
                    .populate({ path: 'account', model: 'Account' })
                    .select('account _id');

                if (!data) {
                    res.send([]);
                }
                else {
                    const array = data.map(row => ({
                        _id: row._id,
                        acount: row.account,
                        name: row.account.name
                    }))

                    res.send(array);
                }

            } catch (error) {
                res.send(error)
            }
        }
    }

    getTeacherInformation(req, res) {
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
                        .populate({ path: "homeroomClass", model: "Class" })
                        .populate({ path: "account", model: "Account" })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                };
            });
        }
    }

    getClassesBySubjectTeacher(req, res) {
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
                        .populate({ path: 'classInCharge', model: 'Class' })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                };
            });
        }
    }

}

module.exports = new TeacherController;