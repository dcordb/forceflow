import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import process from "node:process";
import { DAEMON_FILE } from "./config.js";
import { fileOrDirExists } from "./utils.js";

async function initDaemon() {
  if (await fileOrDirExists(DAEMON_FILE)) return;

  const child = spawn("node", ["./src/parseServer.js"], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
}

async function stopDaemon() {
  const exists = await fileOrDirExists(DAEMON_FILE);

  if (!exists) return;

  const content = await fs.readFile(DAEMON_FILE, { encoding: "utf8" });
  const daemonInfo = JSON.parse(content);

  try {
    process.kill(daemonInfo.pid, "SIGTERM");
  } catch (e) {
    console.log("failed to stop daemon process");
    return;
  }
}

export { initDaemon, stopDaemon };
