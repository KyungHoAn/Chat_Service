const socket = new WebSocket(`ws://${window.location.host}`)   //front - back 연결 websocket

socket.addEventListener("open",() => {
    console.log("connected to server ");
});

socket.addEventListener("message",(message) => {
    console.log("New message: ", message.data)
});

socket.addEventListener("close", () => {
    console.log("Disconnected frotm Server ") 
});

setTimeout(() => {
    socket.send("hello from the browser!")      //backend server 로 socket message 보내기
}, 10000);