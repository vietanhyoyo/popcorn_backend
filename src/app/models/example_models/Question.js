const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Question = new Schema({
    question: { type: String, maxLength: 100, required: true },
    correct: { type: String, maxLength: 1, required: true },
    A: { type: String, maxLength: 100, required: true },
    B: { type: String, maxLength: 100, required: true },
    C: { type: String, maxLength: 100, required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true }
})

module.exports = mongoose.model('Question', Question);