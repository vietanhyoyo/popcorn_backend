const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolYear = new Schema({
    name: { type: String, maxLength: 9, required: true, unique: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('SchoolYear', SchoolYear);