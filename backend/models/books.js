const mongoose = require('mongoose');

const books = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    desc: String,
    price: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Books', books);