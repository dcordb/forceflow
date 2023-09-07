import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import process from "node:process";
import { DAEMON_FILE } from "./config.js";
import { fileOrDirExists } from "./utils.js";
import { DaemonError } from "./errors.js";

async function initDaemon() {
  if (await fileOrDirExists(DAEMON_FILE))
    throw new DaemonError("Daemon could not be started");

  const child = spawn("node", [`${process.env.FORCEFLOW}/src/parseServer.js`], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
}

async function stopDaemon() {
  const exists = await fileOrDirExists(DAEMON_FILE);

  if (!exists) throw new DaemonError("Daemon could not be stopped");

  const content = await fs.readFile(DAEMON_FILE, { encoding: "utf8" });
  const daemonInfo = JSON.parse(content);

  try {
    process.kill(daemonInfo.pid, "SIGTERM");
  } catch (e) {
    throw new DaemonError("Failed to terminate the daemon process");
  }
}

export { initDaemon, stopDaemon };
