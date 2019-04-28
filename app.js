const express = require('express');
const app = express();
const mongoClient = require('mongoose');
const dbUrl = require('./backend/config/db');

const storeRoutes = require('./backend/endpoints/store');
const orderRoutes = require('./backend/endpoints/orders');
const userRoutes = require('./backend/endpoints/user');
const bodyParser = require('body-parser');

mongoClient.connect(dbUrl, { authSource: 'admin' }, function (err, db) {
    if (err) {
        console.log("Auth Failed");
        return;
    }
    console.log("MongoDB Connected");
    db.collection('purchases').find().toArray(function(err, docs) {
        console.log(JSON.stringify(docs));
    });
    
    // db.close();
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Defining endpoints for users
app.use('/api/orders', orderRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);

//Define error handler
app.use((req, res, next) => {
    const error = new Error('Please read api document and retry');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        Status: error.status,
        Message: error.message,
        context: 'api'
    });
});

module.exports = app;