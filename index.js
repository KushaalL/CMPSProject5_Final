const pug = require('pug');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.use(express.static('public'));

const Database = require('./ContactDB');
const db = new Database();
db.initialize();

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.get('/favicon.ico',(req, res) => {
    res.status(404).send("404 error");
});

app.use('/',require('./routes/contacts'));



app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
});