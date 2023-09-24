const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Link = new Schema({
    link: { type: String, maxLength: 255, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    status: { type: String, maxLength: 50, default: 'off' },
    timeCreate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Link', Link);