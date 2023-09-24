const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonContent = new Schema({
    text: { type: String },
    video: { type: String },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('LessonContent', LessonContent);