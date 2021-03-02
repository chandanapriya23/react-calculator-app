const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3001;

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
})

http.listen(PORT, function(){
  console.log('listening on *:', PORT);
});