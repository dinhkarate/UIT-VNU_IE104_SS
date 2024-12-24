const express = require('express');
const config = require("./config/index.js");
const cors = require('cors')
const route = require('./routes/index');
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

route(app); 

app.use(express.static(path.join(__dirname, '../SS_FE/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../SS_FE/views/pages', 'index.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/news.html'));
});

app.get('/news/top', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/news-topnews.html'));
});

app.get('/news/knowledge', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/sport_knowledge.html'));
});

app.get('/policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/policy.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/owner.html'));
});

app.get('/tournament', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/tournament.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/sign_up.html'));
});

app.get('/list_court', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/list_court.html'));
});

app.get('/list_court/court_detail', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/list_court_court.html'));
});

app.get('/forget_password', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/forget_password.html'));
});

app.get('/forget_password_phone', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/forget_password_sdt.html'));
});

app.get('/forget_password_email', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/forget_password_mail.html'));
});

app.get('/new_password', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/new_password.html'));
});

app.get('/otp_phone', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/otp_sdt.html'));
});

app.get('/otp_mail', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/login/otp_mail.html'));
});

app.get('/login/*', (req, res) => {
  res.redirect('/login');
});

app.get('/news/*', (req, res) => {
  res.redirect('/news');
});

app.get('/policy/*', (req, res) => {
  res.redirect('/policy');
});

app.get('/owner/*', (req, res) => {
  res.redirect('/owner');
});

app.get('/tournament/*', (req, res) => {
  res.redirect('/tournament');
});

app.get('/register/*', (req, res) => {
  res.redirect('/register');
});

app.get('/list_court/*', (req, res) => {
  res.redirect('/list_court');
});

app.get('/forget_password/*', (req, res) => {
  res.redirect('/forget_password');
});

app.get('/forget_password_phone/*', (req, res) => {
  res.redirect('/forget_password_phone');
});

app.get('/forget_password_email/*', (req, res) => {
  res.redirect('/forget_password_email');
});

app.get('/new_password/*', (req, res) => {
  res.redirect('/new_password');
});

app.get('/otp_phone/*', (req, res) => {
  res.redirect('/otp_phone');
});

app.get('/otp_mail/*', (req, res) => {
  res.redirect('/otp_mail');
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/profile.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/payment.html'));
});

app.get('/tournament/tournament_detail', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/tournament_detail.html'));
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });