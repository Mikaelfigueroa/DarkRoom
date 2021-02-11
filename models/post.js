var mongoose                = require("mongoose")

var postSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId,ref: "user"},
    caption:   String,
    image:    {type: String, required: true},
    likes:    [{
      image: String,
      username: String,
      id: String,
      date: {type: Date,default: Date.now}
  }],
    date: {type: Date,default: Date.now},
    hashtags: [{type: String}]
})

module.exports = mongoose.model("post", postSchema)
