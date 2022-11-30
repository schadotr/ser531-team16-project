var express = require('express');
var requestify = require('requestify');
var app = express();

var dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT != undefined ? process.env.PORT : 3000, () => {
    console.log("Here");
});

app.get('/hello', (req, res) => {
    res.send("hello");
});

app.get('/world', (req, res) => {
    res.send("world");
});
