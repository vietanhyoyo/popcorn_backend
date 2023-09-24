const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassContent = new Schema({
    title: { type: String, maxLength: 100, required: true },
    text: { type: String },
    date: { type: Date },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('ClassContent', ClassContent);