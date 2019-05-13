const mongoose = require("mongoose");
const validator = require("validator");

const Note = mongoose.model("Note", {
  user_id: {
    type: String
  },
  note_body: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean
  },
  edit: {
    type: Boolean
  },
  color: {
    type: String
  }
});

module.exports = Note;
