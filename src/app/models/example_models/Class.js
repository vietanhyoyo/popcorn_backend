const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Class = new Schema({
    name: { type: String, maxLength: 10, required: true },
    grade: { type: String, required: true },
    schoolYear: { type: Schema.Types.ObjectId, ref: 'SchoolYear', required: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Class', Class);