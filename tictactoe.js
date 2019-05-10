const winners = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function addMove(move){
  const {x,y} = move.pos;
  if((this.moves.length%2 &&move.playerType!=='cross') ||
    (!(this.moves.length%2) &&move.playerType!=='circle') ||
    this.moves.find(m=>m.x===x&&m.y===y) || this.won
  ) return;
  else{
    const newMove = {type:move.playerType,...move.pos,index:3*x+y}
    this.moves.push(newMove)
    if(getWinningLine(this.moves)){
      newMove.winLine = getWinningLine(this.moves);
      this.won = true;
    }
    return newMove
  }
}
function getWinningLine(moves){
  if(moves.length<5) return false;
  const playerMoves = moves.filter((m,i)=>(i-moves.length)%2);
  let winLine = false;
  winners.forEach(winnerPositions=>{
    if(winnerPositions.reduce((acc,wPos)=>acc&&playerMoves.findIndex(m=>m.index===wPos)!==-1,true)){
      winLine = winnerPositions
    }
  })
  return winLine;
}

module.exports = function(id){
  this.id=id;
  this.moves = [];
  this.won = false;

  this.addMove = addMove;
}
