const express = require("express")      //express 를 사용하게 되면 자동적으로 node_modules를 보게 된다.
const http = require("http")
const app = express();
const path = require("path")
const server = http.createServer(app)
const socketIO = require("socket.io")
const moment = require("moment")
const figlet = require('figlet');
const io = socketIO(server)
 
app.use(express.static(path.join(__dirname,"src")))
const PORT = process.env.PORT || 5000;      // 포트가 지정되어있으면 지정된 포트로 OR 5000

io.on("connection",(socket) => {
    socket.on("chatting",(data) => {    //데이터 받는 부분
        const {name, msg} = data;
        io.emit("chatting", {
            name,
            msg,
            time:  moment(new Date()).format("h:mm A")
        })
    })
})

figlet('Kyung Ho!!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

server.listen(PORT, ()=>console.log(`server is running ${PORT}`))