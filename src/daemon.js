import { spawn } from "node:child_process";
import { fileOrDirExists } from "./utils.js";
import { CONFIG_DIR } from "./config.js";
import * as fs from "node:fs/promises";
import path from "node:path";

const DAEMON_FILENAME = "daemon.json";

async function initDaemon() {
  const daemonInfo = path.join(CONFIG_DIR, DAEMON_FILENAME);

  if (await fileOrDirExists(daemonInfo)) return;

  const child = spawn("node", ["./src/parseServer.js"], {
    detached: true,
    stdio: "ignore",
  });

  try {
    await fs.writeFile(daemonInfo, JSON.stringify({ pid: child.pid }));
  } catch (err) {
    console.error("failed to write daemonInfo file");
  }

  child.unref();
}

export { initDaemon };
