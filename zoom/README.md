# Zoom clone coding (Noom)
- Zoom Clone using NodeJS,  WebRTC and Websockets.
- Websocket은 Socket IO가 실시간, 양방향, event 기반 통신을 제공하는 방법 중 하나
- websocket에 문제가 생겨도 socket IO는 계속 동작을 한다.

### Websocket 구성 단계
1. HTTP 서버 생성
```
const server = http.creatServer()
```
- zoom clone code 에서는 새로운 websocket를 만들 때 HTTP를 위에 쌓아올리면서 만들었다.
```
const wss = new WebSocket.Server({server})
```


### Socket IO
- socket IO 는 프론트와 백엔드 간 실시간 통신을 가능하게 해주는 프레임워크 라이브러리
- 브라우저가 주는 websocket은 socket IO와 호환이 되지 않는다. => socketIO가 더 많은 기능을 제공하기 때문 => socket IO를 브라우저에 설치해야한다.
- socket IO는 webSocket보다 조금 무겁다 -> websocket API는 브라우저에 설치되어있기 때문
- socket IO를 이용하면 방에 참가하고 떠나는 것이 매우 간단하다.

1. 특정한 event를 emit해줄 수 있다. 어떤이름이든 상관없이
```
socket.emit("room", {payload:input.value})
```
2. object 전송 가능

_disconnected & disconnecting_
- disconnected 는 연결이 완전히 끊어진것
- disconnecting은 고객이 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않은 것