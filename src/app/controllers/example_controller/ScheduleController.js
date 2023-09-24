
const Schedule = require('../models/Schedule');
const ScheduleLesson = require('../models/ScheduleLesson')
const SchoolYear = require('../models/SchoolYear');
const Class = require('../models/Class')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Link = require('../models/Link')
const jwt = require("jsonwebtoken")
const numberLesson = require('../../define/numberLesson')

class ScheduleController {

    async getAllSchedule(req, res) {

        try {
            const schoolYear = await SchoolYear.findOne({}, {}, { sort: { createdAt: -1 } });

            const schedule = await Schedule.find({ schoolYear: schoolYear._id })

            res.send(schedule);

        } catch (error) {
            res.send(error)
        }

    }

    async getAllScheduleLesson(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const idSchedule = req.body.id;

                const result = await ScheduleLesson.find({ schedule: idSchedule });

                res.send(result);

            } catch (error) {
                res.send(error)
            }
        }
    }

    async getScheduleLessonByWeekdayAndClass(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const data = req.body;

                const result = await ScheduleLesson
                    .find({ schedule: data.id, class: data.class, weekday: data.weekday })
                    .populate({ path: 'subject', model: 'Subject' });

                res.send(result);

            } catch (error) {
                res.send({ message: "Error", error })
            }
        }
    }

    async addSchedule(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                //Tao thoi khoa bieu
                const schoolYear = await SchoolYear.findOne({}, {}, { sort: { createdAt: -1 } })
                if (!schoolYear) res.sendStatus(422);

                const checkDate = new Date(req.body.startDate);
                let semester;

                if (checkDate.getMonth() + 1 > 6) semester = "1";
                else semester = "2";

                const data = {
                    ...req.body,
                    schoolYear: schoolYear._id,
                    semester
                }

                const newSchedule = await Schedule.create(data);

                //Tao cac mon hoc trong thoi khoa bieu
                const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu'];
                const lessonNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                const classes = await Class.find({ schoolYear: schoolYear._id }).sort({ name: 1 });

                for (let i = 0; i < days.length; i++) {
                    for (let j = 0; j < lessonNumbers.length; j++) {
                        for (let k = 0; k < classes.length; k++) {

                            const newScheduleLesson = {
                                weekday: days[i],
                                lessonNumber: lessonNumbers[j],
                                class: classes[k]._id,
                                schedule: newSchedule._id,
                            }

                            await ScheduleLesson.create(newScheduleLesson);
                        }
                    }
                }

                res.send(newSchedule);
            } catch (error) {
                res.send(error);
            }
        }
    }

    async deleteScheduleById(req, res) {
        if (!req.body) {
            res.sendStatus(400);
        } else {
            try {
                const idSchedule = req.body.id;

                await ScheduleLesson.deleteMany({ schedule: idSchedule });
                await Schedule.deleteOne({ _id: idSchedule });

                res.send({ status: 'Success', message: 'Xóa thời khóa biểu thành công!' });

            } catch (error) {
                res.send(error)
            }

        }
    }

    async updateScheduleLesson(req, res) {
        if (!req.body) {
            res.sendStatus(400);
        } else {
            try {
                const scheduleLesson = await ScheduleLesson.findOne({
                    _id: req.body.id
                })
                if (!scheduleLesson) res.send({ status: 'Error' });
                const errorScheduleLesson = await ScheduleLesson.find({
                    schedule: scheduleLesson.schedule,
                    weekday: scheduleLesson.weekday,
                    lessonNumber: scheduleLesson.lessonNumber,
                    teacher: req.body.teacherID
                })
                console.log(errorScheduleLesson);
                if (errorScheduleLesson.length !== 0) {
                    res.send({ status: 'Error', message: 'Lịch bị trùng' })
                }
                else {
                    const result = await ScheduleLesson.updateOne(
                        { _id: req.body.id },
                        { teacher: req.body.teacherID, subject: req.body.subjectID })

                    res.send({status: 'Success', result});
                }
            } catch (error) {
                res.send(error);
            }

        }
    }

    async getScheduleLessonByLessonNumber(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const data = req.body;

                const result = await ScheduleLesson
                    .findOne({ schedule: data.id, class: data.class, weekday: data.weekday, lessonNumber: data.lessonNumber })
                    .populate({ path: 'subject', model: 'Subject' })
                    .populate({ path: 'teacher', model: 'Teacher' })

                res.send(result);

            } catch (error) {
                res.send({ message: "Error", error })
            }
        }
    }

    async getScheduleLessonByTeacher(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const data = req.body;

                const result = await ScheduleLesson
                    .findOne({ schedule: data.id, teacher: data.teacherID, weekday: data.weekday, lessonNumber: data.lessonNumber })
                    .populate({ path: 'subject', model: 'Subject' })
                    .populate({ path: 'class', model: 'Class' })

                res.send(result);

            } catch (error) {
                res.send({ message: "Error", error })
            }
        }
    }

    async getScheduleOfUser(req, res) {
        try {
            const authorization = req.headers['authorization'];
            if (!authorization) res.sendStatus(401);
            //'Beaer [token]'
            const token = authorization.split(' ')[1];

            if (!token) res.sendStatus(401);

            else {
                const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                if (user.role === 2) {
                    const student = await Student.findOne({ account: user._id })
                    const schedule = await Schedule.findOne({}, {}, { sort: { 'endDate': -1 } })
                    res.send({ classID: student.class, schedule })
                }
                else if (user.role === 1) {
                    const teacher = await Teacher.findOne({ account: user._id })
                    if (teacher.homeroomTeacher) {
                        const schedule = await Schedule.findOne({}, {}, { sort: { 'endDate': -1 } })
                        res.send({ classID: teacher.homeroomClass, schedule, teacherID: teacher._id })
                    }
                    else {
                        const schedule = await Schedule.findOne({}, {}, { sort: { 'endDate': -1 } })
                        res.send({ schedule, teacherID: teacher._id })
                    }
                }
            }
        } catch (error) {
            res.send(error)
        }

    }

    async getScheduleLessonByClass(req, res) {
        if (!req.body) res.sendStatus(400);
        else {
            try {
                const schedule = await Schedule.findOne({}, {}, { sort: { 'endDate': -1 } })

                const data = req.body;
                // const d = new Date()
                const d = new Date(2022, 11, 7, 8, 10)
                const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

                const dataFind = {
                    schedule: schedule.id,
                    weekday: weekdays[d.getDay()],
                    lessonNumber: data.lessonNumber,
                    class: data.classID
                }

                const result = await ScheduleLesson
                    .findOne(dataFind)
                    .populate({ path: 'subject', model: 'Subject' })
                    .populate({ path: 'class', model: 'Class' })

                if (result === null) {
                    res.send({ data: result, numberLesson: data.lessonNumber, status: 'off' });
                } else if (result.subject) {
                    const nLesson = numberLesson[Number(data.lessonNumber) - 1];
                    const lessonDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), nLesson.start_hour, nLesson.start_minute);
                    const lessonTime = lessonDate.getTime();
                    const dTime = d.getTime();
                    const time = ((dTime - lessonTime) / 60000).toFixed(0);
                    console.log(lessonTime, dTime, time);

                    if (result.teacher) {
                        const link = await Link.findOne({ teacher: result.teacher, status: 'on' })
                        res.send({ data: result, numberLesson: nLesson, status: 'on', time, link });
                    }
                    else res.send({ data: result, numberLesson: nLesson, status: 'on', time });
                } else {
                    res.send({ data: result, numberLesson: data.lessonNumber, status: 'off' });
                }

            } catch (error) {
                res.send({ message: "Error", error })
            }
        }
    }

}

module.exports = new ScheduleController;