const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Management = new Schema({
    code: { type: String, required: true, unique: true },
    learnStatus: { type: String, required: true },
})

module.exports = mongoose.model('Management', Management);