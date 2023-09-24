const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const News = new Schema({
    text: { type: String, required: true },
    usersLike: [{ type: Schema.Types.ObjectId, ref: 'Account'}],
    createUser: { type: Schema.Types.ObjectId, ref: 'Account', required: true},
    isDelete: { type: Boolean, default: false }
}, {
    timestamps: true
})

module.exports = mongoose.model('News', News);