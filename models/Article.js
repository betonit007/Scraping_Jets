var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required:true
    },
    snip: {
        type: String,
        required:true
    },
    pic: {
        type: String,
        required:true
    },
    
    
    ///ref/link to a user created note for a particular article
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;