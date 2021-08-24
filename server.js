const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Get & listen to index.html on page load
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); 
  });

// Get notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

// Set up the same Get/Post functions here as they grab from the same route:
app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })

    // Creates new note to existing db.json file.
    .post(function (req, res) {
        let jsonFile = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let highestNoteId = 99;

        // For loop to loop through the array to find the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestNoteId) {
                // This limits the highestId to be the highest id/number in the array, which is 99.
                highestNoteId = individualNote.id;
            }
        }

        newNote.id = highestNoteId + 1;
        database.push(newNote)

        // Add newNote to the db.json file via WriteFile:
        fs.writeFile(jsonFile, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        res.json(newNote);
    });


//Listen to PORT & set up the server.
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});