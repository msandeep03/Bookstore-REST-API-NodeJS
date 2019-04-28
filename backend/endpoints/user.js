// Store endpoint is used to signup/login using users collection
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtKey = "someKey";

// POST /signup with urlencoded or json raw data should add a new user with email/password provided.
router.post('/signup', (req, res, next) => {
    const _email = req.body.email;
    console.log(_email);

    User
        .find({ email: _email })
        .exec()
        .then(user => {
            if (user.length) {
                console.log(user.length);
                return res.status(200).json({
                    context: 'user',
                    message: 'User already exists! Hit /api/user/login'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log("context: user-create-bcrypt; err - " + err);
                        return res.status(500).json({
                            context: 'user',
                            error: "context: user-create-bcrypt; err - " + err,
                            message: 'Internal Error'
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: _email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                return res.status(200).json({
                                    context: 'user',
                                    message: 'User created successfully',
                                    result: {
                                        email: result.email,
                                        dateCreated: result.createdAt
                                    }
                                });
                            })
                            .catch(err => {
                                console.log("context: user-create-catch; err - " + err);
                                return res.status(500).json({
                                    context: 'user',
                                    message: 'Internal Error',
                                    error: "context: user-create-catch; err - " + err
                                });
                            });
                        console.log(user);
                    }
                });
            }
        })
        .catch(err => {
            {
                console.log("context: user-find-catch; err - " + err);
                return res.status(404).json({
                    message: 'Internal Error',
                    context: 'user',
                    error: "context: user-find-catch; err - " + err
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    const _email = req.body.email;
    console.log(_email);

    User
        .find({ email: _email })
        .exec()
        .then(user => {

            if (user.length > 1) {
                return res.status(404).json({
                    context: 'user',
                    message: 'Multiple user accounts found! Signup with unique account. Hit /api/user/signup'
                });
            }
            else if (user.length == 1) {
                console.log(req.body.password);
                console.log(user[0].password);
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    console.log(result);
                    if (err) {
                        console.log("context: user-found-err; err - " + err);
                        return res.status(401).json({
                            message: 'Internal Error',
                            context: 'user',
                            error: "context: user-found1; err - " + err
                        });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            id: user[0]._id
                        },
                            jwtKey);
                        return res.status(200).json({
                            message: 'Successful login',
                            context: 'user',
                            authToken: token
                        });
                    } else return res.status(401).json({
                        message: 'Wrong credentials! Try again.',
                        context: 'user',
                    });

                });
            } else {
                return res.status(404).json({
                    message: 'User not found. Hit /api/user/signup',
                    context: 'user',
                });
            }
        })
        .catch(err => {
            {
                console.log("context: user-find-catch");
                return res.status(404).json({
                    message: 'Something went wrong. HINT: Pass email, password to login',
                    context: 'user',
                });
            }
        });
});

module.exports = router; 