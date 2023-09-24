const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleLesson = new Schema({
    weekday: { type: String, required: true },
    lessonNumber: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('ScheduleLesson', ScheduleLesson);