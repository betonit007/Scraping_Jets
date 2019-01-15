var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: [true, "Title cannot be a duplicate"]
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
    Saved: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        required:true
        
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    
    
    ///ref/link to a user created note for a particular article
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;