function load(port) {
  const form = document.querySelector(".console__form");
  const messageField = document.querySelector(".form__input");
  const submitBtn = document.querySelector(".form__btn-submit");

  const listview = ListView({
    components: {
      input: messageField
    }
  });

  let socket;

  function init() {
    listview.reset();

    socket = CreateSocket(port, {
      onopen: function(event) {
        SocketStatus.toggle(false, event.currentTarget.url);
        SwitchBtn.toggle(false);
      },
      onerror: function(event) {},
      onmessage: function(event) {
        const message = event.data;
        listview.appendItem("received", message);
      },
      onclose: function(event) {
        SocketStatus.toggle(true);
        SwitchBtn.toggle(true);
      }
    });

    socket.init = init;

    SwitchBtn.bindSocket(socket);
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
    const message = messageField.value;

    // Send the message through the WebSocket.
    socket.send(message);

    // Add the message to the messages list.
    listview.appendItem("sent", message);

    // Clear out the message field.
    messageField.value = "";

    return false;
  };
}
