#!/usr/bin/env node

const program = require("commander");
const { setup } = require("./lib/server.js");
const path = require("path");

// TODO: get version from package.json
program
  .version("0.1.2")
  .option("-c --config [config]", "Set the config to [config]")
  .parse(process.argv);

const configPath = program.config
  ? path.resolve(process.cwd(), program.config)
  : path.resolve(__dirname, "./test/config.js");

const config = require(configPath);

if (!/^[\d]+$/.test(config.port)) {
  console.error("Invalid port!");
  process.exit(1);
}

setup(config);
