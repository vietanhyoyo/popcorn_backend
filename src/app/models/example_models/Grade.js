const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Grade = new Schema({
    name: { type: String, maxLength: 2, required: true, unique: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
})

module.exports = mongoose.model('Grade', Grade);