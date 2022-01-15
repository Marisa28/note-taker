const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const publicDir = path.join(__dirname, "/public");
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/notes", function (req, res) {  res.sendFile(path.join(publicDir, "notes.html"));});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
  //res.json(`${req.method} request received to get notes`);
  res.sendFile(path.join(__dirname, "/db/db.json"));
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// GET request for a single review
app.get('/api/notes/:notes_id', (req, res) => {
  if (req.body && req.params.notes_id) {
    console.info(`${req.method} request received to get a single a notes`);
    const noteId = req.params.note_id;
    let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    for (let i = 0; i < notes.length; i++) {
      const currentNote = notes[i];
      if (currentNote.note_id === noteId) {
        res.json(currentNote);
        return;
      }
    }
    res.json('Note ID not found');
  }
});

app.get("*", function (req, res) {  res.sendFile(path.join(publicDir, "index.html"));});

// POST request to add a notes
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);
    console.log("req.body", req.body);
  // Destructuring assignment for the items in req.body
  const note = req.body;
    console.info ("note",note);
  // If all the required properties are present
  if (note) {
    // Variable for the object we will save
    const newNote = note;
      newNote.id = uuid(),
 

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        console.log ("parsedNotes", parsedNotes)
        // Add a new review
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated Notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting Note');
  }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);