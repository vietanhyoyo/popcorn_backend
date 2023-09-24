const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, maxLength: 255, required: true, unique: true },
    avatar: { type: String, maxlength: 255 },
    password: { type: String, maxLength: 255, required: true },
    name: { type: String, maxLength: 255, required: true },
    birthday: { type: Date },
    role: { type: Number, default: 0 },
    refreshToken: { type: String, maxLength: 255, default: null },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('Account', Account);