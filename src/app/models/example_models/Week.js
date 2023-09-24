const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Week = new Schema({
    name: { type: String, maxLength: 9, required: true },
    semester: { type: String, maxLength: 7, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Week', Week);