"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
if (!process.env.CONFIG_PATH)
    throw "Empty CONFIG_PATH !";
var config = require(process.env.CONFIG_PATH);
server_1.setup(config);
