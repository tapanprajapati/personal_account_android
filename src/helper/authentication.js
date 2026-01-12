const jwt = require("jsonwebtoken");
require("dotenv").config();

function Authentication(){}

Authentication.prototype.generateToken = function(user){
    return jwt.sign({user}, process.env.JWT_SECRET, { });
}

Authentication.prototype.verifyToken = function(req, res, next){
    const header = req.headers["authorization"];
    if (!header) {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "No Authorization header provided!",
        });
    }

    const bearer = header.split(" ");

    if (bearer.length !== 2) {
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "Invalid Authorization header!",
        });
    }

    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Failed to authenticate!");
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Failed to authenticate!",
            });
        }
        req.user = user;
        next();
    });
}

module.exports = new Authentication();
