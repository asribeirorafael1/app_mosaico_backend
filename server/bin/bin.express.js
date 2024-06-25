const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true
}));
app.use(bodyParser.json({limit:'150mb'}));
app.use(cors());

module.exports = app;