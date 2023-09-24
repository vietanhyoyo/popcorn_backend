const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lesson = new Schema({
    title: { type: String, maxLength: 100, required: true },
    note: { type: String, maxLength: 255 },
    date: { type: Date },
    week: { type: Schema.Types.ObjectId, ref: 'Week', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    grade: { type: String, maxLength: 2, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Lesson', Lesson);