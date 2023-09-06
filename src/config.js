import path from "node:path";
import os from "node:os";
import { fileOrDirExists } from "./utils.js";
import { mkdir } from "node:fs/promises";

const CONFIG_DIR = path.join(os.homedir(), ".forceflow");
const DAEMON_FILE = path.join(CONFIG_DIR, "daemon.json");
const LANGS_FILE = path.join(CONFIG_DIR, "langs.json");

async function createConfigDir() {
  const exists = await fileOrDirExists(CONFIG_DIR);

  if (!exists) await mkdir(CONFIG_DIR);
}

createConfigDir();

export { CONFIG_DIR, DAEMON_FILE, LANGS_FILE };
