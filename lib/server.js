const Koa = require("koa");
const WebSocket = require("ws");
const views = require("koa-views");
const path = require("path");

const { sendAutoMsg, pretreatMsg } = require("./utils.js");

function getWSS(port) {
  const app = new Koa();

  app.use(
    views(path.join(__dirname, "./view"), {
      extension: "ejs"
    })
  );

  app.use(async ctx => {
    await ctx.render("index", {
      title: "Mock Client Console",
      port
    });
  });

  const server = app.listen(port, () => {
    console.log(`Mock server is running!`);
    console.log(`Vist http://localhost:${port} for frontend console.`);
  });

  const wss = new WebSocket.Server({ server });

  return wss;
}

function setup({ port, rule, autoMsgTimeout }) {
  const wss = getWSS(port);

  wss.broadcast = (data, user) => {
    wss.clients.forEach(client => {
      if (client.user === user) return;
      client.send(JSON.stringify(data));
    });
  };

  let index = 0;
  wss.on("connection", (ws, req) => {
    ws.user = `User ${String.fromCharCode(65 + index++)}`;
    wss.broadcast(`${ws.user} enters Console room`, ws.user);

    ws.on("message", message => {
      if (!message) return;
      console.log(`receive ${message} from ${ws.user}`);

      message = pretreatMsg(message);

      if (rule && message) sendAutoMsg(ws, rule, message, autoMsgTimeout);

      wss.broadcast(message, ws.user);
    });

    ws.on("error", console.warn);
  });
}

module.exports = {
  setup
};
