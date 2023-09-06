import winston from "winston";
import { CONFIG_DIR } from "./config.js";
import path from "node:path";

const DAEMON_LOG = path.join(CONFIG_DIR, "daemon.log");

const daemonLogger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.File({ filename: DAEMON_LOG })],
});

export { daemonLogger };
