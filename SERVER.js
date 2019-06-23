var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
const translate = require('@k3rn31p4nic/google-translate-api');
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var mangUsers=[];

io.on("connection", function(socket){
  console.log("Co nguoi ket noi " + socket.id);

  socket.on("client-send-Username", function(data){
    if(mangUsers.indexOf(data)>=0){
      socket.emit("server-send-dki-thatbai");
    }else{
      mangUsers.push(data);
      socket.Username = data;
      socket.emit("server-send-dki-thanhcong", data);
      io.sockets.emit("server-send-danhsach-Users", mangUsers);
    }
  });

  socket.on("logout", function(){
    mangUsers.splice(
      mangUsers.indexOf(socket.Username), 1
    );
    socket.broadcast.emit("server-send-danhsach-Users",mangUsers);
  });

  // socket.on("user-send-message", function(data){
  //   io.sockets.emit("server-send-mesage", {un:socket.Username, nd:data} );
  // });
  socket.on("send-message-to-bot", function(data){
    io.sockets.emit("server-send-mesage", {un:socket.Username, nd:data} );
    translate(data, {from: 'en', to: 'vi'}).then(res => {
      console.log(res.text);
      io.sockets.emit("bot-send-mesage", {un:"bot", nd:res.text} );
      //=> false
  }).catch(err => {
      console.error(err);
  });
    
  });

  socket.on("typing", function(){
    var s = socket.Username + " dang go chu";
    io.sockets.emit("user_typing", s);
  });

  socket.on("user_stop_typing", function(){
    io.sockets.emit("user_stop_typing");
  });


});

app.get("/", function(req, res){
  res.render("trangchu");
});
