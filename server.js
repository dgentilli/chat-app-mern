require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

/**Socket IO*/
io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("message", function(msg) {
    console.log("message: ", msg);
  });
  socket.on("disconnect", function() {
    console.log("a user disconnected");
  });
});

/**API*/
const messages = require("./api/messages")(io);
const users = require("./api/users")(io);

app.use(express.static(__dirname));

/**PRODUCTION CODE ONLY
 *Serve static files from the React frontend app
 */
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "client/build/index.html"));
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**Test Route*/
app.get("/", (req, res) => res.send("Chatbot server is running."));

/**API Routes*/
app.use("/api/messages", messages); // Messages API
app.use("/api/users", users); // Users API

/**DB config - MongoDB Atlas (using ENV variables)*/
const dbURI = process.env.mongoURI;

/**Connect to MongoDB*/
mongoose.connect(dbURI, { useNewUrlParser: true }).then(
  () => {
    console.log("MongoDB connection established");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

/**Passport middleware*/
app.use(passport.initialize());

/**Passport config*/
require("./config/passport")(passport);

/**Run server*/
const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server running on port ${port}`));
