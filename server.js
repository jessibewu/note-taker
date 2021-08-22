const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./Develop/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Get & listen to index.html on page load
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
  });

// Get notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
})

//Listen to PORT & set up the server.
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});