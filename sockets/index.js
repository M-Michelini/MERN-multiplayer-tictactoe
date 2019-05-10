module.exports = function(server){
  const io = require('socket.io')(server)
  const games = {}
  io.sockets.on('connection',async function (socket) {
    console.log(socket.id+' connected');
    require('./queue')(io,socket,(newGame)=>{
      if(newGame){
        games[newGame.id] = newGame;
      }
    })
    require('./move')(io,socket,games)
    socket.on('message', function (message) {
      io.sockets.emit('move',message)
    });
    socket.on('disconnect',()=>{
      const rooms = socket.adapter.rooms
      const gameId = Object.keys(rooms).find(roomId=>games[roomId])
      console.log(socket.id+' dc-d');
      if(gameId){
        const players = Object.keys(rooms[gameId].sockets)
        if(!games[gameId].won) io.to(gameId).emit('forfeit')
        io.sockets.connected[players[0]].leave(gameId)
        delete games[gameId]
      }
    })
  })
}
