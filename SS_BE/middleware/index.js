const cookieParser = require('cookie-parser');

const authenticate = (req, res, next) => {
  const isAuthenticated = req.cookies.authenticated === 'true';

  res.locals.isAuthenticated = isAuthenticated;

  next();
};


const authorize = (req, res, next) => {
  const isAuthenticated = req.cookies.authenticated === 'true';

  if (isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  authenticate,
  authorize,
};

//Using JWT token for authorization
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({
            message: 'No token provided!',
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
            });
        }

        req.userId = decoded.id;
        next();
    });
};

export default verifyToken;