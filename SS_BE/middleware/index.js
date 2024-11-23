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