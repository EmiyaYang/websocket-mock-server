const program = require("commander");
const { setup } = require("./lib/server.js");
const { PORT } = require("./lib/config.js");

program
  .version("0.1.0")
  .option("-p --port [port]", "Set the server port to [port]", PORT)
  .parse(process.argv);

if (!/^[\d]+$/.test(program.port)) {
  console.error("Invalid port!");
  process.exit(1);
}

setup({ port: program.port });

module.exports = {
  setup
};
