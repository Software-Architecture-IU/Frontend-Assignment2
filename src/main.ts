const API_URL = "http://stress-testers.ru:8080";
const POLL_INTERVAL = 1000;

const app = document.getElementById("root");
const sendButton = document.getElementById("send-msg");
const updateButton = document.getElementById("get-msg");

const form = document.getElementById("sender");
function handleForm(event: Event) {
  event.preventDefault();
}
form?.addEventListener("submit", handleForm);

let currentOffset = 0;
const messages: Message[] = [];

interface Message {
  id: number;
  text: string;
  timestamp: string;
}

function pollServer() {
  fetch(`${API_URL}/messages?OFFSET=${currentOffset}`)
    .then((res) => res.json())
    .then((data: Message[]) => {
      if (data && data.length) {
        messages.concat(data);
        const newMessage = new CustomEvent("message", {
          detail: { messages: data },
        });
        app!.dispatchEvent(newMessage);
        currentOffset = data[data.length - 1].id;
      }
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
updateButton?.addEventListener("click", pollServer);

function formatTime(time: string) {
  // 12:49 | 12 Jun 2024
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(time);
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} | ${day} ${month} ${year}`;
}

// @ts-expect-error addEventListener does not have overload with CustomEvent event type
app!.addEventListener(
  "message",
  function (event: CustomEvent<{ messages: Message[] }>) {
    const msgList = document.getElementById("msg-list");
    for (const msg of event.detail.messages) {
      const newMsg = document.createElement("div");
      newMsg.className = "msg";

      const msgText = document.createElement("span");
      msgText.appendChild(document.createTextNode(msg.text));
      msgText.className = "msg-txt";

      const msgTime = document.createElement("span");
      msgTime.appendChild(document.createTextNode(formatTime(msg.timestamp)));
      msgTime.className = "msg-time";

      newMsg.appendChild(msgText);
      newMsg.appendChild(msgTime);
      msgList?.appendChild(newMsg);
    }
  }
);

pollServer();
setInterval(pollServer, POLL_INTERVAL);
