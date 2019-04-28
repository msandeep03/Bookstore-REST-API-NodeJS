// Store endpoint is used to add or retrieve book data from the books collection only.
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Books = require('../models/books');
const userAuth = require('../config/auth');

// GET /store/title should return you the details of the book queried
router.get('/:title', (req, res, next) => {
    // Add mongodb fetch/parse query
    const _title = req.params.title;
    
    Books
        .find({ title: _title.toLowerCase() }, { "_id": 1, "title": 2, "desc": 3, "price": 3 })
        .exec()
        .then(doc => {
            if (doc.length)
                return res.status(200).json({
                    context: 'store',
                    message: 'Book details fetched successfully',
                    result: doc
                });
            else
                return res.status(404).json({
                    context: 'store',
                    message: 'Sorry! Book not found.',
                });
        })
        .catch(err => {
            console.log('err: ' + err.message);
            return res.status(500).json({
                Status: error.status,
                Message: "Record not found!",
            });
            //5cc205ba072bc04758b6cfd6  bookTitle1
            //5cc20fc41f08731da8ca86cd  bookTitle4
            //5cc2245bdb18bf4fa8a4659a  bookTitle5
        });
});

// GET /store/title should return you the details of books available in store
router.get('/', (req, res, next) => {
    Books
        .find({}, { "_id": 1, "title": 2, "desc": 3, "price": 4 }).then(doc => {
            return res.status(404).json({
                context: 'store',
                message: 'Book details fetched successfully',
                result: doc,
            });
        });
});

// POST /store with urlencoded or json raw data should add or update book data based on title name.
// Supposedly, if book title exists then update else add new book with desc & price
router.post('/', userAuth, (req, res, next) => {
    if (req.body.title.length == 0 ||
        req.body.desc.length == 0 ||
        req.body.price.length == 0)
        res.status(404).json({
            context: 'store',
            message: 'Failure! Accepts three params (title (string), desc (string), price (integer))',
        });

    const books = new Books({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price
    });
    books.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));
    res.status(200).json({
        context: 'store',
        message: 'Success Added!',
        result: {
            book: books
        }
    });
});

module.exports = router; 