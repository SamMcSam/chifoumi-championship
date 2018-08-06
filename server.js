var app = require("express")();
var server = require('http').Server(app);
var ent = require("ent");
var io = require('socket.io')(server);
var ejs = require('ejs');

var players = [];
var roooms = [];
var games = [];

server.listen(8080);

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.get("/", function(req, res) {
    res.render('index.html');
});

io.sockets.on("connection", function(socket){

	

});
