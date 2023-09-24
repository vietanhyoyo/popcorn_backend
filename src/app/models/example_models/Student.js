const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    name: { type: String, require: true },
    sex: { type: String },
    account: { type: Schema.Types.ObjectId, ref: 'Account', require: true },
    idStudent: { type: String, maxlength: 20, unique: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    ethnic: { type: String, maxlength: 20 },
    phoneNumber: { type: String, maxlength: 20 },
    birthday: { type: Date },
    homeTown: { type: String, maxlength: 100 },
    address: { type: String, maxlength: 255 },
    parent: { type: String, maxlength: 255 },
    email: { type: String, maxlength: 30 },
    avatar: { type: String, maxlength: 255 },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Student', Student);