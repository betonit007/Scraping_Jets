var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


var PORT = process.env.PORT || 8000;

// Initialize Express
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars");


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

require('./routes/jetFuel.js')(app);

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapingJets";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



// Start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
  });
  