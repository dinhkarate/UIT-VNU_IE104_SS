//Using JWT token for authorization
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authenticate = (req, res, next) => {
    try{
        const token = req.cookies.token;
        const check = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (check) {
            req.body.cust_id = check.cust_id;
            next()
        };
    }
    catch(err){
        return res.redirect('/');
    };
};

module.exports = authenticate;