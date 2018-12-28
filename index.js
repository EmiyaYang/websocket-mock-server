#!/usr/bin/env node
const program = require("commander");
const path = require("path");

const supervisor = require("supervisor/lib/supervisor");

// TODO: get version from package.json
program
  .version("0.1.+")
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

process.env.config = config;

supervisor.run(["--watch", configPath, "--", "./lib/main.js"]);
