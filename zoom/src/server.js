import http from "http";
// import WebSocket from "ws";      //websocket code
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); 
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/")); 

// 두개의 port 를 같은 port 로 연결하기 위함
const httpServer = http.createServer(app);      // http 서버가 있으면 그 위에 ws서버를 생성할 수 있다.
const wsServer = new Server(httpServer);  

wsServer.on("connection",(socket) => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer",(offer, roomName) => {
        socket.to(roomName).emit("offer",offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    })
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    })
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);   //  == ws://localhost:3000
httpServer.listen(3000, handleListen);
