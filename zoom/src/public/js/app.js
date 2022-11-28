const messageList = document.querySelector("ul")
const nickForm = document.querySelector("#nick")
const messageForm = document.querySelector("#message")
const socket = new WebSocket(`ws://${window.location.host}`)   //front - back 연결 websocket

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open",() => {
    console.log("connected to server ");
});

socket.addEventListener("message",(message) => {
    const li = document.createElement("li")
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected frotm Server ") 
});

function handleSubmit(event) {
    event.preventDefault(); 
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.value = "";
}

messageForm.addEventListener("submit",handleSubmit);
nickForm.addEventListener("submit",handleNickSubmit);
// setTimeout(() => {
//     socket.send("hello from the browser!")      //backend server 로 socket message 보내기
// }, 10000);
{
    type:"message";
    payload:"hello everyone!";
}
{
    type:"nickname";
    payload:"hey";
}