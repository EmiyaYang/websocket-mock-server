import { setup } from "./server";

if (!process.env.CONFIG_PATH) throw "Empty CONFIG_PATH !";

const config = require(process.env.CONFIG_PATH);

setup(config);
