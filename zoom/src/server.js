import http from "http";
// import WebSocket from "ws";      //websocket code
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); 
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/")); 

const handleListen = () => console.log(`Listening on http://localhost:3000`);   //  == ws://localhost:3000

// 두개의 port 를 같은 port 로 연결하기 위함
const httpServer = http.createServer(app);      // http 서버가 있으면 그 위에 ws서버를 생성할 수 있다.
const wsServer = SocketIO(httpServer);          //socketIO

wsServer.on("connection",socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    })
    socket.on("enter_room",(roomName, done) => {
        socket.join(roomName);      // 방 번호
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });       // 어떤 event든 전송 가능
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message",(msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })
    socket.on("nickname", nickname => socket["nickname"] = nickname)
});

/** WebSocket Code */
// const wss = new WebSocket.Server({ server })    // http 와 ws 서버를 동시에 두기 위해서 합쳤다. 두개 따로 돌려도 된다.
// const sockets = [];
// wss.on("connection", (socket) => {      // socket에 연결 여러 곳에서 실행되면 여러번 실행된다.
//     sockets.push(socket);
//     socket["nickname"] = "Anon";        //익명으로 nickname을 준다.
//     console.log("connected to browser ");
//     socket.on("close",()=> console.log("Disconnected from the Browser"))
//     socket.on("message", (msg) => {         //socket이 메시지를 보낼 때까지 기다림  
//         const message = JSON.parse(msg);
//         switch(message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket =>  //다른 모두에게 익명이 보낸 메시지를 전송한다.
//                     aSocket.send(`${socket.nickname}: ${message.payload}`));    //nickname property를 socket object에 저장
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     });
// });

httpServer.listen(3000, handleListen);
