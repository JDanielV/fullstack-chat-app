import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");
  // const sessionId = localStorage.getItem("sessionId");
  // if (sessionId) {
  //   socket.auth = { sessionId };
  //   socket.connect();
  // }

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  // socket.on("session", ({ sessionId, userId }) => {
  //   socket.auth = { sessionId };
  //   localStorage.setItem("sessionId", sessionId)
  //   socket.userId = userId;
  // });

  // socket.on("new-message", (data) => {
  //   store.dispatch(setNewMessage(data.message, data.sender));
  // });
  socket.on("receive-message", (data) => {
    console.log("DATA", data)
    store.dispatch(setNewMessage(data.message, data.sender));
  });
});

export default socket;
