function CreateSocket(port, payload) {
  const socket = new WebSocket(`ws://localhost:${port}`);
  socket.onerror = function(error) {
    console.log("WebSocket Error: " + error);
    payload && payload.onerror && payload.onerror(error);
  };

  // Show a connected message when the WebSocket is opened.
  socket.onopen = function(event) {
    payload && payload.onerror && payload.onopen(event);
  };

  // Handle messages sent by the server.
  socket.onmessage = function(event) {
    payload && payload.onerror && payload.onmessage(event);
  };

  // Show a disconnected message when the WebSocket is closed.
  socket.onclose = function(event) {
    payload && payload.onerror && payload.onclose(event);
  };
  return socket;
}

const ListView = (function() {
  const dom = document.querySelector(".console__listview");

  function _scrollToBottom() {
    dom.scrollTop = dom.scrollHeight - dom.clientHeight;
  }

  function appendItem(type, msg) {
    const item = document.createElement("li");
    if (type === "received") item.className = "listview__item-received";
    else if (type === "sent") item.className = "listview__item-sent";
    item.innerHTML = msg;
    dom.append(item);
    _scrollToBottom();
  }

  function reset() {
    dom.innerHTML = "";
  }

  return {
    appendItem,
    reset
  };
})();

const SwitchBtn = (function() {
  const dom = document.querySelector(".form__btn-switch");

  const status = [
    {
      class: "form__btn form__btn-switch form__btn-off",
      title: "Close Connection"
    },
    {
      class: "form__btn form__btn-switch form__btn-on",
      title: "Reconnect"
    }
  ];

  function toggle(on) {
    const s = status[on + 0]; // trun boolean into number;
    dom.className = s.class;
    dom.innerHTML = s.title;
  }

  function bindSocket(socket) {
    if (!socket instanceof WebSocket) throw new Error("Invalid socket!");
    dom.onclick = function(e) {
      e.preventDefault();

      if (socket.readyState === socket.OPEN) {
        socket.close();
      } else if (socket.readyState === socket.CLOSED) {
        socket.init();
      }

      return false;
    };
  }

  return {
    bindSocket,
    toggle
  };
})();

const SocketStatus = (function() {
  const dom = document.querySelector(".console__status");

  const status = [
    {
      class: "console__status console__status-on",
      title: "Connected to"
    },
    {
      class: "console__status console__status-off",
      title: "Disconnected from WebSocket."
    }
  ];

  function toggle(on, info) {
    const s = status[on + 0]; // trun boolean into number;
    dom.className = s.class;
    dom.innerHTML = s.title + info;
  }

  return {
    toggle
  };
})();
