interface Config {
  port: number;
  rule: () => any;
  autoMsgTimeout: number;
}

declare namespace WSMock {
  type ws = import("ws");
  interface WebSocket extends ws {
    user: string;
    Server: import("ws").Server;
  }
}
