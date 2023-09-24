const bcrypt = require('bcrypt-nodejs');
const Account = require('../../models/example_models/Account');
const Student = require('../../models/Student');
const jwt = require("jsonwebtoken")

class StudentController {

    async addStudent(req, res) {
        try {
            if (!req.body) res.sendStatus(400);
            else {
                const data = req.body;
                const availableAccount = await Account.findOne({ username: data.username });

                if (availableAccount) res.send({ status: 'Error', message: 'Tên đăng nhập đã được sử dụng!' });
                else {
                    const newPass = await bcrypt.hashSync(data.password, bcrypt.genSaltSync(5), null);
                    const newAccount = await Account.create({
                        username: data.username,
                        password: newPass,
                        name: data.name,
                        role: 2
                    })
                    const newStudent = await Student.create({
                        name: data.name,
                        sex: data.sex,
                        account: newAccount._id,
                        idStudent: data.idStudent,
                        class: data.class,
                        address: data.address,
                        parent: data.parent,
                        ethnic: data.ethnic,
                        birthday: data.birthday,
                        homeTown: data.homeTown,
                        phoneNumber: data.phoneNumber,
                        email: data.email,
                        avatar: data.avatar
                    })
                    res.send({ status: 'Success', data: newStudent, message: 'Tạo thành công học sinh mới!' })
                }
            }
        } catch (error) {
            res.send({ status: 'Error', message: 'Lỗi khi tạo tài khoản!', error });
        }
    }

    async getStudentInClass(req, res) {
        try {
            if (!req.body) res.sendStatus(400);
            else {
                const data = req.body;
                let classFilter = { class: null };
                if (data.class !== null) {
                    classFilter = { class: data.class };
                }

                const students = await Student.find(classFilter).populate({ path: 'account', model: 'Account' });
                res.send(students);
            }
        } catch (error) {
            res.send({ status: 'Error', message: 'Lỗi khi lấy dữ liệu!', error });
        }
    }

    async deleteStudent(req, res) {
        if (!req.body.idStudent || !req.body.idAccount) res.sendStatus(400);
        else {
            try {
                await Student.deleteOne({ _id: req.body.idStudent });
                await Account.deleteOne({ _id: req.body.idAccount });
                res.send({ status: 'Success', message: 'Xóa thành công!' })
            } catch (error) {
                res.send({ status: 'Error', message: 'Lỗi khi xóa!', error })
            }
        }
    }

    getStudentById(req, res) {
        if (!req.body.id) res.sendStatus(400);
        else {
            Student.findById(req.body.id)
                .populate({ path: 'account', model: 'Account' })
                .exec((error, doc) => {
                    if (error) res.send({ status: 'Error', message: 'Lỗi khi tìm dữ liệu', error });
                    else res.send({ status: 'Success', data: doc });
                })
        }
    }

    async updateStudent(req, res) {
        try {
            if (!req.body) res.sendStatus(400);
            else {
                const accountData = req.body.account;
                const studentData = req.body.student;

                await Account.updateOne({ _id: accountData._id }, accountData);
                await Student.updateOne({ _id: studentData._id }, studentData);

                res.send({ status: 'Success', accountData, studentData });
            }
        } catch (error) {
            res.send({ status: 'Error', message: 'Lỗi trong cập nhật', error });
        }
    }

    getInformation(req, res) {
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
                    console.log('student: ',)
                    Student.findOne({ account: data._id })
                        .populate({ path: 'class', model: 'Class' })
                        .populate({ path: 'account', model: 'Account' })
                        .exec((error, doc) => {
                            if (error) res.send(error);
                            else res.send(doc);
                        })
                };
            });
        }
    }

    async countStudent(req, res) {
        try {
            const students = await Student.find({});
            console.log(students.length)
            res.send({ countStudent: students.length });
        } catch (error) {
            res.send(error);
        }
    }

}

module.exports = new StudentController;