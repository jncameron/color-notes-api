const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://jncamdev:CAMERONDEV@cluster0-i65n7.mongodb.net/test?retryWrites=true",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);
