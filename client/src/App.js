import React,{Component} from 'react';
import './App.css';
import io from "socket.io-client";

class App extends Component{
  constructor(){
    super();
    this.state = {
      queue:true,
      circle:true,
      messages:[],
      moves:[],
      winner:false,
      winLine:false,
      forfeit:false
    }
    this.socket=io("http://localhost:3001")
    this.socket.on('connect',()=>{
      this.socket.on('queue',queue=>{
      })
      this.socket.on('start',gameSettings=>{
        this.setState({queue:false,...gameSettings})
      })
      this.socket.on('move-success',newMove=>{
        console.log(newMove)
        this.setState({
          moves:[...this.state.moves,newMove]
        })
      })
      this.socket.on('move-winner',winMove=>{
        console.log(winMove)
        this.setState({
          moves:[...this.state.moves,winMove],
          winLine:winMove.winLine,
          winner:winMove.winner
        })
      })
      this.socket.on('forfeit',_=>{
        this.setState({
          forfeit:true
        })
      })
    })
  }
  emitMove(e){
    if(this.state.winner||this.state.forfeit) return;
    let board = e.target;
    while(board.id!=='game-board'){
      board=board.parentElement
    }
    const rect = board.getBoundingClientRect();
    const scale = 3/rect.width
    console.log(scale)
    const x = Math.floor(scale*(e.clientX - rect.left));
    const y = Math.floor(scale*(e.clientY - rect.top));
    this.socket.emit('move',{
      gameId:this.state.gameId,
      move:{
        pos:{x,y},
        playerType:this.state.playerType
      }
    })
  }

  render(){
    const {queue,moves,winner,playerType,forfeit}=this.state;
    if(queue) return <div>IN QUEUE. WAITING FOR MORE PLAYERS...</div>;
    const moveEls = moves.map((m,i)=>(
      m.type==='circle'?
        <circle key={i} cx={100*m.x+50} cy={100*m.y+50} r="35" stroke="red" strokeWidth="10" fill="none" />:
        <g key={i}>
          <line x1={100*m.x+10} y1={100*m.y+10} x2={100*m.x+90} y2={100*m.y+90} strokeWidth="10" stroke="blue"/>
          <line x1={100*m.x+10} y1={100*m.y+90} x2={100*m.x+90} y2={100*m.y+10} strokeWidth="10" stroke="blue"/>
        </g>
    ))
    return (
      <div className="App">
        {
          forfeit ? <h1>Player disconnected. You win be forfeit.</h1>:
          !winner ? <h1>You play {playerType}</h1>:
          <h1>You {winner===this.socket.id?'Win':'Lose'}</h1>
        }
        <svg id="game-board" width="100%" viewBox="0 0 300 300" onClick={this.emitMove.bind(this)}>
          <line className='draw' x1="100" y1="0" x2="100" y2="300"/>
          <line className='draw' x1="200" y1="0" x2="200" y2="300"/>
          <line className='draw' x1="0" y1="100" x2="300" y2="100"/>
          <line className='draw' x1="0" y1="200" x2="300" y2="200"/>
          {moveEls}
        </svg>
      </div>
    );
  }
}
export default App;
