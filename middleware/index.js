//this file allows me to create a middleware object to call in all my different routes so i can keep them orginized in here instead of re writting them on each route file
var comment    = require("../models/comment")
var post      = require("../models/post")

var middleware = {}

middleware.checkPostOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        post.findById(req.params.id, function(err,userResult){
            if(err || !userResult){
                res.status(500).send("cant do that")
            }
            else{
                if(userResult.user._id.equals(req.user._id)){ //here i am using a mongoose function that allows me to compare a data points id with the data point send in the parameter
                    next()
                }
                else{
                    res.status(500).send("cant do that")
                }
            }
        })
    }
    else{
        res.status(500).send({message: "cant do that"})
    }
}

middleware.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,commentResult){
            if(err || !commentResult){
                res.status(500).send("cant do that")
            }
            else{
                if(commentResult.user._id.equals(req.user._id)){ //here i am using a mongoose function that allows me to compare a data points id with the data point send in the parameter
                    next()
                }
                else{
                    res.status(500).send("cant do that")
                }
            }
        })
    }
    else{
        res.status(500).send("cant do that")
    }
}

middleware.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.status(500).send("not logged in")
}


module.exports = middleware
