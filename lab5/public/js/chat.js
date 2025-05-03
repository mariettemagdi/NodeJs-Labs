class ChatClient {
  constructor() {
    this.socket = new WebSocket(`ws://${window.location.host}/posts`);

    //event handlers at client side browsers
    this.socket.onopen = () => {
      console.log("connected to server ");
      this.socket.send(
        JSON.stringify({ type: "join", message: "User Joined" })
      );
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.log("disconnected from chat server");
    };
  }
  displayMessage(data) {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      const messageElement = document.createElement("div");
      messageElement.innerHTML = ` <strong>${new Date(
        data.timestamp
      ).toLocaleTimeString()}</strong>`;
      chatContainer.appendChild(messageElement);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  handleMessage(data) {
    if (data.type == "chat") {
      this.displayMessage(data);
    } else if (data.type === "online") {
      this.updateOnlineUsers(data.users);
    } else {
      console.log("unknown message", data.type);
    }
  }

  updateOnlineUsers(users) {
    const usersList = document.getElementById("users-list");
    if (usersList) {
      usersList.textContent = users.join(",");
    }
  }
  sendMessage(content) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "chat", content }));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.chatClient = new ChatClient();

  const form = document.getElementById("chat-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("message-input");
      if (input.value) {
        window.chatClient.sendMessage(input.value);
        input.value = "";
      }
    });
  }
});
