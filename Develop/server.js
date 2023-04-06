const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

const app = express();

const PORT = process.env.port || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        err ? console.error(err) : res.json(JSON.parse(data))
    });
});

app.listen('3000', (req, res) => console.log(`Listening at PORT ${PORT}.`));