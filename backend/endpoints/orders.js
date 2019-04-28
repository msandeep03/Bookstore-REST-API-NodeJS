// /orders
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Purchases = require('../models/purchase');
const Books = require('../models/books');
const userAuth = require('../config/auth');
const jwt = require('jsonwebtoken');
const jwtKey = "someKey";

//Handle incoming GET requests to /orders endpoint with order ID
router.get('/:orderID', (req, res, next) => {
    const orderID = req.body.orderID;
    const token = req.headers.authorization.split(" ")[1];
    req.resp = jwt.verify(token, jwtKey);
    Purchases
        .find({ $and: [{ email: req.resp.email }, { order_id: orderID }] },
            { "_id": 1, "email": 2, "book_id": 3 }).then(doc => {
                console.log(doc);
                return res.status(200).json({
                    context: 'orders',
                    message: 'Orders fetched successfully',
                    result: doc,
                });
            });
});

// Fetch all orders placed by the user. NEEDS AUTH
router.get('/', userAuth, (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    req.resp = jwt.verify(token, jwtKey);
    Purchases
        .find({ email: req.resp.email }, { "_id": 1, "email": 2, "book_id": 3 }).then(doc => {
            console.log(doc);
            return res.status(200).json({
                context: 'orders',
                message: 'Orders fetched successfully',
                result: doc,
            });
        });
});

// POST /order with book id places an order for that book
router.post('/', userAuth, (req, res, next) => {
    const book_id = req.body.id ? req.body.id : '';
    const book_title = req.body.title ? req.body.title : '';

    console.log(book_id);
    console.log(book_title);

    if (!(book_id.length || book_title.length))
        return res.status(404).json({
            context: 'order',
            message: 'Failure! Please provide book_id and title',
        });

    Books
        .find({ $and: [{ _id: book_id }, { title: book_title }] }, { "_id": 1 })
        .exec()
        .then(doc => {
            if (doc.length > 1)
                return res.status(200).json({
                    context: 'orders',
                    message: 'Multiple books found by the same title. Please also provide book id to book one.',
                    result: doc
                });
            else if (doc.length == 1) {
                const token = req.headers.authorization.split(" ")[1];
                req.resp = jwt.verify(token, jwtKey);

                const purchases = new Purchases({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.resp.email,
                    book_id: doc[0]._id
                });

                purchases.save()
                    .then(result => console.log("purchases" + purchases))
                    .catch(err => console.log(err));
                return res.status(200).json({
                    context: 'orders',
                    message: 'Booked Successfully!',
                    result: purchases
                });
            }
            else
                return res.status(404).json({
                    context: 'orders',
                    message: 'Sorry! Book not found.',
                });
        })
        .catch(err => {
            console.log('err: ' + err.message);
            return res.status(500).json({
                Status: error.status,
                Message: "Record not found!",
            });
        });
});

module.exports = router; 