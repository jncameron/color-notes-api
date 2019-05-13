const path = require("path");

const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Note = require("./models/note");

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
      console.log(res);
    })
    .catch(e => {
      res.status(400).send("not work, homie: " + e);
    });
});

app.post("/notes", (req, res) => {
  const note = new Note(req.body);
  note
    .save()
    .then(() => {
      res.status(201).send(note);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/completenote", (req, res) => {
  const _id = req.body.note_id;
  Note.findByIdAndUpdate(_id, { completed: true })
    .then(note => {
      res.status(201).send(note);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/deletenote", (req, res) => {
  const _id = req.body.id;
  Note.deleteMany({ user_id: _id, completed: true })
    .then(() => {
      res.status(201).send(note);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/loadnotes", (req, res) => {
  const id = req.body.user_id;
  Note.find({ user_id: id })
    .then(notes => {
      res.status(201).send(notes);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/signin", (req, res) => {
  const email = req.body.email;
  console.log(email);
  User.findOne({ email: email })
    .then(user => {
      console.log(user);
      res.send(user);
    })
    .catch(e => {
      res.status(500).send();
    });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
