var mongoose = require("mongoose")


var commentSchema = new mongoose.Schema({
    post:   String,
    text:   {type: String, required: true},
    user:   {type: mongoose.Schema.Types.ObjectId,ref: "user"},
    replies: [{
      text:{type: String},
      user:{type: mongoose.Schema.Types.ObjectId,ref: "user"}
    }]
})

module.exports = mongoose.model("comment", commentSchema)
