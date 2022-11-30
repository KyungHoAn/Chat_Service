const socket = io();    //io function은 알아서 socket.io를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById("welcome2");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit",handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
})

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left ㅠㅠ`);
})

socket.on("new_message",addMessage);

// 새로운 방이 생성되었음을 알림
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});


////////////////////////// video Face View

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute")
const cameraBtn = document.getElementById("camera")
const camerasSelect = document.getElementById("cameras");

const welcome2 = document.getElementById("welcome");
const call = document.getElementById("call");

call.hidden = true;


let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getAudioTracks()[0]
        cameras.forEach(camera => {
            const option = document.createElement("option")
            option.value = camera.deviceId;
            if(currentCamera.label === camera.label) {
                option.selected = true;
            }
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        });
    }catch(e){
        console.log(e)
    }
}

// videos를 다시 시작하는 방법
async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true, 
        video: {facingMode: "user"},
    };
    const cameraConstraints = {
        audio: true,
        video: {deviceId: {exact: deviceId}},
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream
        if(!deviceId) {
            await getCameras();
        }
    } catch(e) {
        console.log(e)
    }
}
getMedia();

function handleMuteClick() {
    myStream.getAudioTracks().
    forEach((track) => (track.enabled = !track.enabled));
    if(!muted) {
        muteBtn.innerText = "Unmute"
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}
function handleCameraClick() {
    myStream.
    getVideoTracks().
    forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click",handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick);
camerasSelect.addEventListener("input",handleCameraChange);


/////////////// Websocket 
// const messageList = document.querySelector("ul")
// const nickForm = document.querySelector("#nick")
// const messageForm = document.querySelector("#message")
// const socket = new WebSocket(`ws://${window.location.host}`)   //front - back 연결 websocket

// function makeMessage(type, payload) {
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }

// socket.addEventListener("open",() => {
//     console.log("connected to server ");
// });

// socket.addEventListener("message",(message) => {
//     const li = document.createElement("li")
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener("close", () => {
//     console.log("Disconnected frotm Server ") 
// });

// function handleSubmit(event) {
//     event.preventDefault(); 
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message",input.value));
// }

// function handleNickSubmit(event){
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname",input.value));
//     input.value = "";
// }

// messageForm.addEventListener("submit",handleSubmit);
// nickForm.addEventListener("submit",handleNickSubmit);
// // setTimeout(() => {
// //     socket.send("hello from the browser!")      //backend server 로 socket message 보내기
// // }, 10000);
// {
//     type:"message";
//     payload:"hello everyone!";
// }
// {
//     type:"nickname";
//     payload:"hey";
// }
