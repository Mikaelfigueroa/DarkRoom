require("dotenv").config()
var express = require("express")            //connects express to node.js
var app = express()                     //creates the app object which is everything
var bodyparser = require("body-parser")        //connects body parser which vars us get data from html forms
var mongoose = require("mongoose")           //connects mongoose
var passport = require("passport")
var localstrategy = require("passport-local")
var path = require("path")

const cookieParser = require("cookie-parser")
const cors = require('cors')

var post = require("./models/post")
var comment = require("./models/comment")
var user = require("./models/user")
var conversation = require("./models/conversation")

/*-----------------requiring routes------------------------------------------------------------------------------------------------------------*/
var userRoutes = require("./routes/user")
var postRoutes = require("./routes/post")
var commentRoutes = require("./routes/comment")




/*---------------------db----------------------------------------------------------------------------------------------------------------------*/
var url = process.env.DBURL;
mongoose.connect(url);

//-------------------------middlewares-------------------------------------------------//
app.use(express.json());
app.use(express.static("public"))
app.use(bodyparser.json({ limit: '10mb', extended: true }))
app.use(bodyparser.urlencoded({ limit: "10mb", extended: true }))

app.use(cors({
  origin: "https://darkroom123.herokuapp.com/",
  credentials: true,
}));

app.use(require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(cookieParser(process.env.SECRET));


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())





app.use(commentRoutes)
app.use(postRoutes)
app.use(userRoutes)

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


var http = require('http').createServer(app);
var socketio = require('socket.io');
var io = socketio(http)
//---------------------------------chat-----------------------------------------------//

var connectedUsers = {};
io.on('connection', socket => {
  socket.on("chatjoin", (socket1) => {
    connectedUsers[socket1._id] = socket
    socket.on('disconnecting', () => {
      delete connectedUsers[socket1._id]
    });
  })
  socket.on("message", (socket1) => {
    var senderId = socket1.senderId
    var receiverId = socket1.receiverId
    var receiverSocket = connectedUsers[receiverId]
    if (receiverSocket) {

      receiverSocket.emit("newMessage", {
        username: socket1.senderUsername,
        text: socket1.text
      })
    }

    conversation.findOne({ users: { $all: [senderId, receiverId] } }, (err, result) => {
      if (!result) {
        conversation.create({
          users: [senderId, receiverId],
          messages: [{
            username: socket1.senderUsername,
            text: socket1.text
          }]
        }, function (err, result) {
        })
      }
      else {
        result.messages.push({
          username: socket1.senderUsername,
          text: socket1.text
        })
        result.save(function (err, result) {

        })
      }
    })
  })
})
//--------------------------------------------------------------------------------//
http.listen(process.env.PORT || 5000, () => {
  console.log('----------------server is running-----------')
  console.log('|||||||||||||||||||||||||||||||||||||||||||||||')
})