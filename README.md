A simple and configurable mock server with UI console for websocket, with which you can either send message manually or make rules to get matched response. Err... It's hard to summarize, Let's take a look!

# Installation

## [npm package](https://www.npmjs.com/package/websocket-mock-server)

```
npm install websocket-mock-server
```

## [github repo](https://github.com/EmiyaYang/websocket-mock-server)

```
git clone https://github.com/EmiyaYang/websocket-mock-server.git
```

```
npm install
npm run build
npm run test
```

# Configuration

package.json
```json
{
  "scripts": {
    "mock": "wsmock -c CONFIG_PATH"
  }
}
```

The following config.js will be used and watched as default config when no `CONFIG_PATH` is provided.
```javascript
module.exports = {
  port: 4040,
  // a function exported to handle specific input and return output which will be sending later.
  rule: function (input) {}
  // set the delay time before sending auto message 
  autoMsgTimeout: 1000,
};
```

# Run


Terminal
```
npm run mock
```

![preview](./public/img/preview.png)

The frontend provide a chatroom-like way for you to send WebSocket message to server, which will be broadcast to other clients.


# TODO

- [ ] feat: Serial message flow test; 
