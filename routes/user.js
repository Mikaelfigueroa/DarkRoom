var express = require("express")
var router = express.Router()
var passport = require("passport")

var middleware = require("../middleware")
var user = require("../models/user")
var conversation = require("../models/conversation")

var post = require("../models/post")
var functions = require("../functions")
var uploader = require("../upload")



router.get("/", function (req, res) {
  res.redirect("/post")
})


router.post("/register", function (req, res) {
  var newuser = new user({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  })
  user.register(newuser, req.body.password, function (err, userResult) {
    if (err) {
      res.status(500).send(functions.mongooseFormat(err))
    }
    else {
      passport.authenticate("local")(req, res, function () {
        res.json(userResult);
      })
    }
  })
})

//-------------------------------login logic--------------------------------------------//
router.get("/isloggedin", function (req, res) {
  if (req.user) {
    res.send(req.user)
  }
  else {
    res.send(false)
  }
})

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, userResult) {
    if (!userResult || err) {
      res.status(500).send("Username or password are incorrect")
    } else {
      req.logIn(userResult, function (err) {
        return res.json(userResult);
      })
    }
  })(req, res, next)
})

//--------------------------------logout-------------------------------------------------//
router.get("/logout", function (req, res) {
  req.logout()
  console.log("logged out")
  res.json("logged out")
})

//show
router.get("/user/:id", function (req, res) {
  user.findById(req.params.id, function (err, userResult) {
    if (err) {
      res.status(500).send("something went wrong")
    }
    else {
      res.json(userResult)
    }
  }).select("username image caption followers following")
})


//update user
router.put("/user", middleware.isLoggedIn, uploader.upload.single('image'), function (req, res) {
  if (req.file) {
    uploader.cloudinary.uploader.upload(req.file.path, function (imageResult) {
      user.findById(req.user._id, function (err, userResult) {
        userResult.image = imageResult.secure_url
        if (req.body.caption) {
          userResult.caption = req.body.caption
        }
        userResult.save()
        res.json(userResult)
      })
    })
  }
  else if (req.body.caption) {
    user.findById(req.user._id, function (err, result) {
      result.caption = req.body.caption
      result.save()
      res.json(result)
    })
  }
  else {
    res.status(500).send("something went wrong")

  }
})
///-----------------------likes----------////


//post like
router.get("/like/:id/", middleware.isLoggedIn, function (req, res) {
  post.findById(req.params.id, function (err, result) {
    var foundindex = result.likes.indexOf(result.likes.find(x => x._id.equals(req.user._id)))
    if (foundindex >= 0) {
      result.likes.splice(foundindex, 1)
      result.save()
    }
    else {
      result.likes.push({ _id: req.user._id, image: req.user.image, username: req.user.username })
      result.save()
      user.findById(result.user._id, function (err, userResult) {
        var obj = {
          typeof: "like",
          user: req.user._id,
          linkid: result._id
        }
        userResult.activity.push(obj)
        userResult.save()
      })
    }
    res.json("liked")
  })
})

//follow
router.get("/follow/:id", middleware.isLoggedIn, function (req, res) {
  user.findById(req.user._id).exec(function (err, userResult) {
    if (req.user._id != req.params.id) {

    var foundindex = userResult.following.indexOf(userResult.following.find(x => x.equals(req.params.id)))




      if (foundindex >= 0) {
        userResult.following.splice(foundindex, 1)
        userResult.save()
        user.findById(req.params.id).exec(function (err, innerUserResult) {
          var foundindexother = innerUserResult.followers.indexOf(innerUserResult.followers.find(x => x.equals(req.user._id)) )
          innerUserResult.followers.splice(foundindexother, 1)
          innerUserResult.save()
          res.json(innerUserResult)
        })
      }
      else {
        userResult.following.push(req.params.id)
        userResult.save()
        user.findById(req.params.id).exec(function (err, innerUserResult) {
          innerUserResult.activity.push({
            typeof: "follow",
            user: req.user._id,
            linkid: req.user._id
          })
          innerUserResult.followers.push(req.user._id)
          innerUserResult.save()
          res.json(innerUserResult)
        })
      }





    }
    else{
      res.status(500).send("something went wrong")
    }
  })
})



router.get("/activity", middleware.isLoggedIn, function (req, res) {
  user.findById(req.user._id).populate({
    path: "activity",
    populate: {
      path: "user",
      model: "user",
      select: "image username"

    }
  }).exec(function (err, result) {
    res.json(result.activity)
  })

})








//search
router.post("/search/user", function (req, res) {
  if (req.body.search) {
    function escapeRegex(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }
    const regex = new RegExp(escapeRegex(req.body.search), 'gi')
    user.find({ username: regex }, function (err, userResult) {
      var obj = {}
      obj.result = userResult
      obj.type = "user"
      res.json(obj)
    }).select("username image _id")

  }

  else {
    user.find({}, function (err, result) {
      var obj = {}
      obj.result = result
      obj.type = "user"
      res.json(obj)
    }).select("username image _id")
  }
})

router.post("/search/post", function (req, res) {
  req.body.search = "#" + req.body.search
  post.find({ hashtags: req.body.search }, function (err, postResult) {
    if (err) {
      res.status(500).send("something went wrong")
    }
    var obj = {}
    obj.result = postResult
    obj.type = "post"
    res.json(obj)
  })
})

router.get("/conversations", middleware.isLoggedIn, function (req, res) {
  conversation.find({ users: req.user._id }).populate({ path: "users", select: "username image" }).exec(function (err, result) {
    res.json(result)
  })
})

router.post("/chat", middleware.isLoggedIn, function (req, res) {
  conversation.findOne({ users: { $all: [req.user._id, req.body._id] } }).exec((err, result) => {
    if (result) {
      res.json(result.messages)
    }
    else {
      res.json([])
    }
  })
})

module.exports = router
