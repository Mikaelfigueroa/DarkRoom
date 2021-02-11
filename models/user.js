var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
var validators = require('validator')


var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, validate: [(val) => { return validators.isEmail(val) }, "Please provide a accurate email."] },
  password: String,
  caption: String,
  fullname: { type: String, lowercase: true, required: true },
  image: { type: String, default: "https://res.cloudinary.com/dbjw5nvs2/image/upload/v1588030256/blank-profile-picture-973460_640_kb8bgf.png" },
  following: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date: { type: Date, default: Date.now }
  }],
  followers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date: { type: Date, default: Date.now }
  }],
  conversations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    messages: [{
      username: String,
      text: { type: String },
      date: { type: Date, default: Date.now }
    }]
  }],
  activity: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    linkid: String,
    typeof: String
  }]
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)
