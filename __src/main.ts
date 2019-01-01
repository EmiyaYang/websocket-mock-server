import { setup } from "./server";

try {
  if (!process.env.CONFIG_PATH) throw "Empty CONFIG_PATH !";
  const config = require(process.env.CONFIG_PATH);

  // 配置校验
  if (!/^[\d]+$/.test(config.port)) {
    throw "Invalid port!";
  }

  setup(config);
} catch (err) {
  console.error(err);
  process.exit(1);
}
