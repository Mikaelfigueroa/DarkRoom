var express = require("express")
var router = express.Router()

var post = require("../models/post")
var user = require("../models/user")


var middleware = require("../middleware")
var uploader = require("../upload")

//create
router.post("/post", middleware.isLoggedIn, uploader.upload.single("image"), function (req, res) {
  if (req.file) {
    uploader.cloudinary.uploader.upload(req.file.path, function (imageResult) {
      var newPost = {
        caption: req.body.caption,
        user: req.user._id,
        image: imageResult.secure_url,
        hashtags: req.body.hashtags.split(",")
      }
      post.create(newPost, function (err, postResult) {
        res.json(postResult)
      })
    })
  }
  else {
    res.status(500).send("something went wrong")
  }
})

router.get("/post/user/:id", function (req, res) {
  post.find({ user: req.params.id }, function (err, postResult) {
    res.json(postResult)
  })
})



//feed
router.get("/feed", function (req, res) {
  if (req.user) {
    user.findById(req.user._id,function (err, userResult) {
        var arr = []
        userResult.following.forEach(x =>
          arr.push(x)
        );
        post.find({ 'user': { $in: arr } }).populate({path: "user",select: "username image"}).exec(function (err, postResult) {
          res.json(postResult)
        })
      })
  }
  else {
    post.find({}).populate({path: "user",select: "username image"}).exec(function (err, postResult) {
      res.json(postResult)
    })
  }
})


// Show
router.get("/post/:id", function (req, res) {
  post.findById(req.params.id).populate({path: "user", select: "username image"}).exec( function (err, postResult) {
    res.json(postResult)
  })
})


//Update Route
router.put("/post/:id", middleware.checkPostOwnership, function (req, res) {
  post.findByIdAndUpdate(req.params.id, { caption: req.body.caption, hashtags: req.body.hashtags }, function (err, postResult) {
    res.json(postResult)
  })
})

//delete route
router.delete("/post/:id", middleware.checkPostOwnership, function (req, res) {
  post.findByIdAndRemove(req.params.id, function (err, postResult) {
    res.json("post deleted")
  })
})



module.exports = router
