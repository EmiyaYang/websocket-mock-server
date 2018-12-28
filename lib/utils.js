const WebSocket = require("ws");

module.exports = {
  pretreatMsg: function(msg) {
    if (typeof msg === "object") return msg;
    try {
      return JSON.parse(msg);
    } catch (err) {
      console.warn(err);
    }
    return msg;
  },
  sendAutoMsg: function(ws, rule, input, autoMsgTimeout) {
    if (!(ws instanceof WebSocket)) {
      throw new Error(
        "SendAutoMsg Calling Error: ws is not instance of WebSocket!"
      );
    }
    if (typeof rule !== "function") {
      throw new Error("SendAutoMsg Calling Error: rule is not function!");
    }

    let autoMsg = rule(input);

    if (autoMsg) {
      autoMsg = JSON.stringify(autoMsg);
      console.log(`Send autoMsg to ${ws.user}: ${autoMsg}`);
      setTimeout(() => {
        ws.send(autoMsg);
      }, autoMsgTimeout);
    }
  }
};
