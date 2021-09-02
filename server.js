const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Get & listen to index.html & notes.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); 
  });

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

// Set up the Get/Post functions linking from the same route:
app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })

    // Creates new note to existing db.json file.
    .post(function (req, res) {
        let jsonFile = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let highestNoteId = 100;

        // Loop through the array to find the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestNoteId) {
                // Set highestId to the highest id/number in the array, which is 100.
                highestNoteId = individualNote.id;
            }
        }

        newNote.id = highestNoteId + 1;
        database.push(newNote)

        // Add new notes to the db.json file via WriteFile:
        fs.writeFile(jsonFile, JSON.stringify(database), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Your note has been saved!");
        });
        res.json(newNote);
    });

// Set up the delete function here:
app.delete("/api/notes/:id", function (req, res) {
    let jsonFile = path.join(__dirname, "/db/db.json");
    // Loop through the array to delete existing note by id.
    for (let i = 0; i < database.length; i++) {
        if (database[i].id = req.params.id) {
            // Remove 1 existing note via splice.
            database.splice(i, 1);
            break;
        }
    }
    // Add updated notes back to the db.json file via WriteFile:
    fs.writeFile(jsonFile, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        } 
        console.log("Your note has been deleted!");
        });
        res.json(database);
    });

// Using the wildcard * to return the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); 
  });

//Listen to PORT# to set up the server.
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});