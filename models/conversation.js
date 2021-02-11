var mongoose = require("mongoose")

var conversationSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    messages: [{
      username: String,
      text: { type: String},
      date: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model("conversation", conversationSchema)
