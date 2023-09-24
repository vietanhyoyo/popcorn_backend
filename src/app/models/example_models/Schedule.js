const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Schedule = new Schema({
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    semester: { type: String, maxLength: 7, required: true },
    schoolYear: { type: Schema.Types.ObjectId, ref: 'SchoolYear', required: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Schedule', Schedule);