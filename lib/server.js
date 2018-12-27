const Koa = require("koa");
const WebSocket = require("ws");
const Cookies = require("cookies");
const { PORT } = require("./config.js");

function setup({ port }) {
  port = port || PORT;

  const app = new Koa();

  const server = app.listen(port, () => {
    console.log(`Mock server is running on the localhost:${port}`);
  });

  const wss = new WebSocket.Server({ server });

  const testData = {
    type: "friend",
    message: "测试消息",
    msg_type: "text",
    time: "1998/11/11"
  };

  wss.broadcast = function(data, user) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(testData));
    });
  };

  function connect() {
    wss.on("connection", (ws, req) => {
      if (!ws.user) ws.user = new Date().getTime();

      ws.on("message", message => {
        if (!message) return;
        console.log(`receive ${message} from ${ws.user}`);
        wss.broadcast(message, ws.user);
      });

      ws.send(`用户 ${ws.user} 加入聊天室`);
      ws.on("error", console.log);
    });
  }

  connect();
}

module.exports = {
  setup
};
