const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { error } = require('console');
const generateUniqueId = require('generate-unique-id');
const app = express();

const PORT = process.env.port || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const readCurrentDB = async () => {
    var data = await fs.readFile("./db/db.json", "utf-8")
    return JSON.parse(data)
}
const writeNewDB = (data) => {
    fs.writeFile("./db/db.json", JSON.stringify(data, null, 4), err => {
        err ? console.log(err) : console.log('Wrote new db file.')
    });

};

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', async (req, res) => {
    var notes = await readCurrentDB()
    res.json(notes)
});

app.post('/api/notes', async (req, res) => {
    const { title, text } = req.body
    if (!title || !text) {
        res.json({ error: "You must include valid fields" })
        return
    }
    var newNote = {
        title,
        text,
        id: generateUniqueId()
    }
    var currentNotes = await readCurrentDB()
    console.log(currentNotes);
    currentNotes.push(newNote)
    //write to file the stringiifyed version of my currentNotes
    writeNewDB(currentNotes);
    res.json({ message: "Processing your post" })
});

app.delete('api/notes/:id', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({ error: "Cannot complete request without object id." })
    }
})

app.listen('3000', (req, res) => console.log(`Listening at PORT ${PORT}.`));