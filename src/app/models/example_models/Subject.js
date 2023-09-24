const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Subject = new Schema({
    name: { type: String, required: true, maxLength: 60 },
    status: { type: String, default: '' }
}, {
    timestamps: true
})

module.exports = mongoose.model('Subject', Subject);