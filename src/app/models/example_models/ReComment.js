const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReComment = new Schema({
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
    createUser: { type: Schema.Types.ObjectId, ref: 'Account', required: true},
    text: { type: String, required: true },
    usersLike: [{ type: Schema.Types.ObjectId, ref: 'Account'}],
}, {
    timestamps: true
})

module.exports = mongoose.model('ReComment', ReComment);