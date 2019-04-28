const mongoose = require('mongoose');

const purchase = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    book_id: mongoose.Types.ObjectId
}, {
    timestamps: true
});

module.exports = mongoose.model('Purchases', purchase);