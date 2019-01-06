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

// components: form__input
function ListView({ components }) {
  const dom = document.querySelector(".console__listview");

  function _scrollToBottom() {
    dom.scrollTop = dom.scrollHeight - dom.clientHeight;
  }

  function appendItem(type, msg) {
    const status = document.createElement("div");
    status.className = "listItem__status";
    status.innerHTML = type;
    status.title = "Copy this message";

    status.onclick = function(e) {
      const content = e.currentTarget.nextSibling;

      if (!content) throw new Error("Target content dom is null!");
      if (!components || !components.input)
        throw new Error("No components input");

      const data = content.getAttribute("data-obj");

      if (data) components.input.value = data;
    };

    const content = document.createElement("div");
    content.className = "listItem__content";
    content.setAttribute("data-obj", msg);

    try {
      msg = JSON.parse(msg);
    } catch (e) {
      console.warn(e);
    }

    if (typeof msg === "object") {
      content.innerHTML = jsonViewer(msg, false);
    } else {
      content.innerHTML = msg;
    }

    const item = document.createElement("li");
    item.className = "listview__item listview__item-" + type;
    item.append(status);
    item.append(content);
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
}

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
      title: "Connected to "
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
