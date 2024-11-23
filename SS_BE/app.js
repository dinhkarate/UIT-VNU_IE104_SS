const express = require('express');
const config = require("./config/index.js");
const cors = require('cors')
//const route = require('./route/index');
const bodyParser = require("body-parser");
const path = require('path');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, '../SS_FE/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../SS_FE/views/pages', 'index.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/news.html'));
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
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE/views/pages/register.html'));
});


app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });