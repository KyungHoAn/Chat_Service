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

const handleListen = () => console.log(`Listening on http://localhost:3000`);   //  == ws://localhost:3000

// 두개의 port 를 같은 port 로 연결하기 위함
const httpServer = http.createServer(app);      // http 서버가 있으면 그 위에 ws서버를 생성할 수 있다.
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
});  
instrument(wsServer, {
    auth: false,
    mode: "development",
});        // socketIO

function publicRooms() {
    const {sockets: {adapter: {sids, rooms},},} = wsServer;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    });
    return publicRooms;
}

// 방안에 있는 사람의 숫자를 세는 함수
function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection",socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter)
        console.log(`Socket Event:${event}`);
    });
    
    // 누군가 방에 들어올때 & 나갈 때 알림을 한다.
    socket.on("enter_room",(roomName, done) => {
        socket.join(roomName);      // 방 번호
        done(); 
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change",publicRooms());     // 새로운 방이 생성되었음을 알림
    });       // 어떤 event든 전송 가능
    
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname,  countRoom(room)-1));
    });

    //방을 떠나는 것을 알림
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change",publicRooms());
    });
    // 새로운 메시지가 있을 때
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
