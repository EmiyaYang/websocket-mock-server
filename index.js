#!/usr/bin/env node
const path = require("path");
const supervisor = require("supervisor/lib/supervisor");
const argv = require("yargs").alias("c", "config").argv;

const configPath = argv.c
  ? path.resolve(process.cwd(), argv.c)
  : path.resolve(__dirname, "./test/config.js");

process.env.CONFIG_PATH = configPath;

supervisor.run([
  "--watch",
  configPath,
  "-n",
  "exit",
  "--",
  path.resolve(__dirname, "./lib/main.js")
]);
