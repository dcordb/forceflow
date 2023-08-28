import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { CONFIG_DIR } from "./config.js";
import { fileOrDirExists } from "./utils.js";

const DAEMON_FILE = path.join(CONFIG_DIR, "daemon.json");

async function initDaemon() {
  if (await fileOrDirExists(DAEMON_FILE)) return;

  const child = spawn("node", ["./src/parseServer.js"], {
    detached: true,
    stdio: "ignore",
  });

  try {
    await fs.writeFile(DAEMON_FILE, JSON.stringify({ pid: child.pid }));
  } catch (err) {
    console.error("failed to write daemonInfo file");
  }

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

  await fs.unlink(DAEMON_FILE);
}

export { initDaemon, stopDaemon };
