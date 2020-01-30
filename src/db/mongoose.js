const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0-i65n7.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true`,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);
