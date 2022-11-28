import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); 
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/")); 

const handleListen = () => console.log(`Listening on http://localhost:3000`);   //  == ws://localhost:3000

// 두개의 port 를 같은 port 로 연결하기 위함
const server = http.createServer(app);          // http 서버가 있으면 그 위에 ws서버를 생성할 수 있다.
const wss = new WebSocket.Server({ server })    // http 와 ws 서버를 동시에 두기 위해서 합쳤다. 두개 따로 돌려도 된다.

wss.on("connection", (socket) => {      // socket에 연결
    console.log("connected to browser ");
    socket.on("close",()=> console.log("Disconnected from the Browser"))
    socket.on("message", message => {
        console.log(message.toString('utf8'))
    })
    socket.send("hello!!");
})

server.listen(3000, handleListen);