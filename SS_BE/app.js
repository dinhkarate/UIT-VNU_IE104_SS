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

// Serve static files from the "public" folder located one level up
app.use(express.static(path.join(__dirname, '../Front-End')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../SS_FE', 'views', 'pages', 'index.html'));
});


app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });