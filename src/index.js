const path = require("path");
const jwt = require("jsonwebtoken");

const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Note = require("./models/note");
const auth = require("./auth");

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body, req.password);
    const token = await user.generateAuthToken();

    user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send("not work, homie: " + e);
  }
});

app.post("/signin", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send("no dice");
  }
});

app.post("/istoken", async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const decoded = jwt.verify(token, "thisishowyoudoit");
  try {
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    res.status(200).send(user);
  } catch (e) {
    console.log(e);

    res.status(401).send({ error: "Please Authenticate" });
  }
});

app.post("/notes", auth, (req, res) => {
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

app.post("/completenote", auth, (req, res) => {
  const _id = req.body.note_id;
  Note.findByIdAndUpdate(_id, { completed: true })
    .then(note => {
      res.status(201).send(note);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/deletenote", auth, (req, res) => {
  const _id = req.body.id;
  Note.deleteMany({ user_id: _id, completed: true })
    .then(() => {
      res.status(201).send(note);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/loadnotes", auth, (req, res) => {
  const id = req.body.user_id;
  Note.find({ user_id: id })
    .then(notes => {
      res.status(201).send(notes);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/updatenote", auth, (req, res) => {
  Note.findByIdAndUpdate(
    req.body.note_id,
    { note_body: req.body.updatedText },
    { new: true }
  )
    .then(note => {
      res.send(note);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
