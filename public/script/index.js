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

function load(port) {
  const form = document.querySelector(".console__form");
  const messageField = document.querySelector(".form__input");
  const messagesList = document.querySelector(".console__messages");
  const socketStatus = document.querySelector(".console__status");
  const closeBtn = document.getElementById("close");
  const submitBtn = document.getElementById("submit");

  let socket;

  function init() {
    messagesList.innerHTML = "";
    socket = CreateSocket(port, {
      onopen: function(event) {
        socketStatus.innerHTML = "Connected to: " + event.currentTarget.url;
        socketStatus.className = "open";

        closeBtn.className = "form__btn form__btn-disabled";
        closeBtn.innerHTML = "Close Connection";
      },
      onerror: function(event) {},
      onmessage: function(event) {
        const message = event.data;
        messagesList.innerHTML +=
          '<li class="received"><span>Received:</span>' + message + "</li>";
        messagesList.scrollTop = messagesList.scrollHeight;
      },
      onclose: function(event) {
        socketStatus.innerHTML = "Disconnected from WebSocket.";
        socketStatus.className = "closed";

        closeBtn.className = "form__btn";
        closeBtn.innerHTML = "Connect";
      }
    });
  }

  init();

  form.onkeydown = function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (socket) {
        submitBtn.click();
        return;
      }
    }
  };

  // Send a message when the form is submitted.
  form.onsubmit = function(e) {
    e.preventDefault();

    // Retrieve the message from the textarea.
    let message = messageField.value;

    // eval(`var tmp = ${message}`);

    // message = JSON.stringify(tmp);

    // Send the message through the WebSocket.
    socket.send(message);

    // Add the message to the messages list.
    messagesList.innerHTML +=
      '<li class="sent"><span>Sent:</span>' + message + "</li>";

    messagesList.scrollTop = messagesList.scrollHeight;

    // Clear out the message field.
    messageField.value = "";

    return false;
  };

  // Close the WebSocket connection when the close button is clicked.
  closeBtn.onclick = function(e) {
    e.preventDefault();

    if (socket.readyState === socket.OPEN) {
      socket.close();
    } else if (socket.readyState === socket.CLOSED) {
      init();
    }

    return false;
  };
}
