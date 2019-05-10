module.exports = function(io,socket,games,cb){
  socket.on('move',data=>{
    const game = games[data.gameId];
    const newMove = game.addMove(data.move);
    if(newMove&&newMove.winLine){
      io.to(data.gameId).emit('move-winner',{...newMove,winner:socket.id})
    }
    else if(newMove){
      io.to(data.gameId).emit('move-success',newMove)
    }
  })
}
