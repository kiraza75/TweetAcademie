const express = require("express"); //routing
const cors = require("cors"); //cross origin
const lib = require('./librairie'); //librairie du projet
const multer = require('multer');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server, { origins: "http://localhost:* http://127.0.0.1:*"});
const upload = multer({ dest:"tmp/"});



//middleWares
app.use(express.json());
app.use(cors());

app.post("/inscription", (request, response) => {
    lib.verifRegister(request.body, response);
});

app.post("/uploadImage", upload.single("file"), (request, response) => {
   lib.verifImage(request, response);
});

app.post("/modifyAccount", (request, response) =>{
    lib.verifArguments(request, response);
});

app.post("/login", (request, response) => {
    lib.verifLogin(request.body, response);
});

app.post("/tweet", upload.single("file"), (request, response) => {
    console.log(JSON.parse(request.body.body), request.file);
    lib.verifTweet(request, response);
});

app.post("/getWallTweet", (request, response) => {
    lib.getWallTweet(request, response);
});

app.get("/image/*", (request, response) => {
    lib.pathImage(request, response);
});

app.post("/deleteTweet", (request, response) => {
    lib.deleteTweet(request, response);
});

app.post("/like", (request, response) => {
    lib.likeTweet(request, response);
});

app.post("/retweet", (request, response) => {
    lib.reTweet(request, response);
});

app.post("/deleteAccount", (request, response) => {
    lib.deleteAccount(request, response);
});

app.post("/getInfo", (request, response) =>{
    lib.getInfo(request, response);
});

app.post("/getConv", (request, response) =>{
    lib.getConv(request, response);
});

app.post("/sendMessage", (request, response) =>{
    lib.sendMessage(request, response);
});

app.post("/search", (request, response) => {
    lib.getSearchTweet(request, response);
});

app.post("/follow", (request, response) => {
    lib.follow(request, response);
});

app.post("/contact", (request, response) => {
    lib.contact(request, response);
});

app.post("/getMessage", (request, response) => {
    lib.getMessage(request, response);
});

app.post("/getFollow", (request, response) => {
    lib.getFollow(request, response);
});

app.post("/getFollowing", (request, response) => {
    lib.getFollowing(request, response);
});

server.listen(8080, function () {
    console.log("Server running on Port: 8080");
});

// io

io.on('test', () =>{
    console.log('a user is connected')
});