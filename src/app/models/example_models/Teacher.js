const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Teacher = new Schema({
    name: { type: String, maxLength: 100, required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    ethnic: { type: String, maxLength: 20 },
    birthday: { type: Date },
    sex: { type: String },
    identityCard: { type: String, maxLength: 50, unique: true },
    homeTown: { type: String, maxLength: 100 },
    residence: { type: String, maxLength: 100 },
    phone: { type: String, maxLength: 12 },
    email: { type: String, maxLength: 30 },
    avatar: { type: String, maxLength: 255 },
    socialInsurance: { type: String, maxLength: 20 },
    position: { type: String, maxLength: 75 },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    homeroomTeacher: { type: Boolean, default: false },
    homeroomClass: { type: Schema.Types.ObjectId, ref: 'Class', default: null },
    classInCharge: [{ type: Schema.Types.ObjectId, ref: 'Class', default: null }],
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Teacher', Teacher);