var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapingJets";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


//A GET route for scraping https://nypost.com/tag/new-york-jets/

app.get("/", function(req, res) {
    //res.render("index");
})

app.get("/scrape", function(req, res) {
    axios.get("https://nypost.com/tag/new-york-jets/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article").each(function(i, element) {
            var result = {};

            result.title = $(this).children("header").children("h3").children("a").text();
            result.link = $(this).children("div").children("a").attr("href");
            result.snip = $(this).children("div.entry-content").text();
            result.pic = $(this).children("div.entry-thumbnail").children("a").children("picture").children("source").attr("data-srcset");
            result.date = $(this).children("header").children("div.entry-meta").children("p").text();

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);

            }).catch(function(err) {
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});

//get route to retrieve all articles
app.get("/articles", function(req, res) {
    db.Article.find({}).sort({createDate: -1}).then(function(dbArticle) {

        res.render("index", { articles: dbArticle });
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/viewSaved", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {

        res.render("saved", { articles: dbArticle });
    })
    .catch(function(err) {
        res.json(err);
    });
});

///get route for retrieving all notes
app.get("/notes", function(req, res) {
    db.Note.find({})
    .then(function(dbNotes) {
        res.json(dbNotes);
    });
});

//post route for saving a new note

app.post("/submit", function(req, res) {
    console.log(req.body.notes);
    db.Note.create(req.body).then(function(dbNote) {
        console.log(dbNote);
        //after note is created add ref id to the article note is refferring to
        return db.Article.findOneAndUpdate({_id:req.body.id}, {$push: {note: dbNote.id} }, {new:true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//get all Articles and populate them with their notes
app.get("/populatedArticles", function(req, res) {
    db.Article.find({})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/getNotes/:id", function(req, res) {
    console.log(req.params.id);
    db.Article.findOne({_id:req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.delete("/deleteArticle/:id", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.findOneAndDelete({_id:req.params.id})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.put("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id:req.params.id}, {Saved:true})
    .then(function(dbArticle) {
      res.json(dbArticle);
    });
  });



// Start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
  });
  