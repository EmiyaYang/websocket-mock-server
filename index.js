const program = require("commander");
const { setup } = require("./lib/server.js");
const { PORT } = require("./lib/config.js");
const path = require("path");

program
  .version("0.1.0")
  // .option("-p --port [port]", "Set the server port to [port]", PORT)
  .option("-c --config [config]", "Set the config to [config]")
  .parse(process.argv);

if (!program.config) {
  console.error("Please provide config path!");
  process.exit(1);
}

const config = require(path.resolve(__dirname, program.config));

if (!/^[\d]+$/.test(config.port)) {
  console.error("Invalid port!");
  process.exit(1);
}

setup(config);

// module.exports = {
//   setup
// };
