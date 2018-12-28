#!/usr/bin/env node
const path = require("path");
const supervisor = require("supervisor/lib/supervisor");
const argv = require("yargs").alias("c", "config").argv;

const configPath = argv.c
  ? path.resolve(process.cwd(), argv.c)
  : path.resolve(__dirname, "./test/config.js");

process.env.CONFIG_PATH = configPath;

try {
  const config = require(configPath);

  // 配置校验
  if (!/^[\d]+$/.test(config.port)) {
    console.error("Invalid port!");
    process.exit(1);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}

supervisor.run(["--watch", configPath, "--", "./lib/main.js"]);
