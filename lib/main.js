const { setup } = require("./server.js");

const config = require(process.env.CONFIG_PATH);

setup(config);
