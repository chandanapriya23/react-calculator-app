const http = require('http').createServer();

const io = require('socket.io')(http);

io.on('connection', function(socket){
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
})

http.listen(3001, function() { 
      
    // The server object listens on port 3000 
    console.log("server start at port 3001"); 
}); 

// http.listen(3001, function(){
//   console.log('listening on *:3001');
// });