const app = require('express')();
const server = require('http').Server(app);
const PORT=3001;
require('./sockets')(server)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


server.listen(PORT,()=>{
  console.log(`listening on port: ${PORT}`)
})
