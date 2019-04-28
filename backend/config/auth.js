const jwt = require('jsonwebtoken');
const jwtKey = "someKey";

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // const token = jwt.verify(token, jwtKey);
        req.resp = jwt.verify(token, jwtKey);
        // console.log(req.resp.email);
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            context: "auth",
            message: "Auth Failed!",
            error: err.name
        });
    }
};