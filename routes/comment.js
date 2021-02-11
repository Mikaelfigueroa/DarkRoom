var express = require("express")
var router = express.Router()

var post = require("../models/post")
var comment = require("../models/comment")
var middleware = require("../middleware") // ../middleware is a special path that will always require the approriate middleware code
var functions = require("../functions")


router.get("/post/comment/:id",function(req,res){
  comment.find({post: req.params.id}).populate({
    path: "replies",
      populate:{
        path: "user",
        model: "user",
        select: "image username"
      }
  }).populate({path: "user", select: "image username"}).exec(function(err,commentRresult){
    res.json(commentRresult)
  })
})

//create
router.post("/post/comment/:id", middleware.isLoggedIn, function (req, res) {
    var newcomment = {
      text: req.body.text,
      user: req.user._id,
      post: req.body.post
    }
    comment.create(newcomment, function (err, commentResult) {
      if(err){
        res.status(500).send("something went wrong")

      }
      else{
        res.json(commentResult)

      }
    })
})






//reply post
router.post("/post/reply/:id", middleware.isLoggedIn, function (req, res) {
  comment.findById(req.params.id).populate("user").populate({
    path: "replies",
      populate:{
        path: "user",
        model: "user",
        select: "username image"
      }
  }).exec(function (err, commentResult) {
      var commentobj = {
        text: req.body.text,
        user: req.user
      }
      commentResult.replies.push(commentobj)
      commentResult.save()
      res.json(commentResult)
  })
})

module.exports = router
