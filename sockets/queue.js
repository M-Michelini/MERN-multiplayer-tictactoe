const uuid = require('uuid');
const TicTacToe = require('../tictactoe');

module.exports = async function(io,socket,cb){
  const queue = io.sockets.adapter.rooms.queue;
  if(queue){
    const opponent = io.sockets.connected[Object.keys(queue.sockets)[0]];
    const gameId = 'game-'+uuid();
    await opponent.leave('queue');
    await opponent.join(gameId);
    await socket.join(gameId);

    socket.emit('start',{
      gameId,
      playerType:'circle'
    })
    opponent.emit('start',{
      gameId,
      playerType:'cross'
    })
    cb(new TicTacToe(gameId));
  }else{
    socket.join('queue',()=>{
      socket.emit('queue')
    })
  }
}
