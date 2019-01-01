import path from "path";
import ws from "ws";
import Koa from "koa";
import views from "koa-views";
import kStatic from "koa-static";

import { sendAutoMsg, pretreatMsg } from "./utils";

type WebSocket = WSMock.WebSocket;

function getWSS(port: number) {
  const app = new Koa();

  app.use(kStatic(path.join(__dirname, "../public")));

  app.use(
    views(path.join(__dirname, "../public/view"), {
      extension: "ejs"
    })
  );

  app.use(async (ctx: Koa.Context) => {
    const path = ctx.URL.pathname;
    if (path === "/")
      await ctx.render("index", {
        title: "Mock Client Console",
        port
      });
  });

  const server = app.listen(port, () => {
    console.log(`Mock server is running!`);
    console.log(`Visit http://localhost:${port} for frontend console.`);
  });

  const wss = new ws.Server({ server });

  return wss;
}

function setup({ port, rule, autoMsgTimeout }: Config) {
  const wss: any = getWSS(port);

  wss.broadcast = (data: any, user: string) => {
    wss.clients.forEach((client: WebSocket) => {
      if (client.user === user) return;
      client.send(JSON.stringify(data));
    });
  };

  let index = 0;
  wss.on("connection", (ws: WebSocket, req: Koa.Request) => {
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

export { setup };
