const API_URL = "http://stress-testers.ru:8080";
const app = document.getElementById("root");
const sendButton = document.getElementById("send-msg");
let currentOffset = 0;
let messages: Message[] = [];

interface Message {
  id: number;
  text: string;
  timestamp: string;
}

function init() {
  fetch(`${API_URL}/messages?OFFSET=0`)
    .then((res) => res.json())
    .then((data: Message[]) => {
      messages = data;
      const newMessage = new CustomEvent("message", {
        detail: { messages: data },
      });
      app?.dispatchEvent(newMessage);
      currentOffset = data[data.length - 1].id;
      setInterval(pollServer, 2000);
    })
    .catch((err) => {
      console.error("Failed to initialize messenger:");
      throw err;
    });
}

function pollServer() {
  fetch(`${API_URL}/messages?OFFSET=${currentOffset}`)
    .then((res) => res.json())
    .then((data: Message[]) => {
      messages.concat(data);
      const newMessage = new CustomEvent("message", {
        detail: { messages: data },
      });
      app?.dispatchEvent(newMessage);
      currentOffset = data[data.length - 1].id;
    })
    .catch((err) => {
      console.error("Failed to poll messages:");
      throw err;
    });
}

function handleSend() {
  const msgInput = document.getElementById("msg-input") as HTMLInputElement;
  const msg = msgInput.value;
  fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: msg }),
  }).catch((err) => {
    console.error("Failed to create a message:");
    throw err;
  });
  msgInput.value = "";
}
sendButton?.addEventListener("click", handleSend);

// @ts-ignore
app?.addEventListener(
  "message",
  function (event: CustomEvent<{ messages: Message[] }>) {
    const msgList = document.getElementById("msg-list");
    for (let msg of event.detail.messages) {
      const newMsg = document.createElement("div");
      newMsg.className = "msg";

      const msgText = document.createElement("span");
      msgText.appendChild(document.createTextNode(msg.text));
      msgText.className = "msg-txt";

      const msgTime = document.createElement("span");
      msgTime.appendChild(document.createTextNode(msg.timestamp));
      msgTime.className = "msg-time";

      newMsg.appendChild(msgText);
      newMsg.appendChild(msgTime);
      msgList?.appendChild(newMsg);
    }
  }
);

init();
