import path from "node:path";
import os from "node:os";
import { fileOrDirExists } from "./utils.js";
import { mkdir } from "node:fs/promises";
import * as fs from "node:fs";

const CONFIG_DIR = path.join(os.homedir(), ".forceflow");
const DAEMON_FILE = path.join(CONFIG_DIR, "daemon.json");
const LANGS_FILE = path.join(CONFIG_DIR, "langs.json");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

async function createConfigDir() {
  const exists = await fileOrDirExists(CONFIG_DIR);

  if (!exists) {
    await mkdir(CONFIG_DIR);
    const obj = { code_dir: CODE_DIR };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(obj, null, 4));
  }
}

await createConfigDir();

function loadConfig() {
  let data = null;

  try {
    data = fs.readFileSync(CONFIG_FILE, { encoding: "utf8" });
  } catch (e) {
    return {};
  }

  return JSON.parse(data);
}

const configData = loadConfig();
const CODE_DIR = path.join(CONFIG_DIR, configData.code_dir || "code");

async function createCodeDir(dir) {
  const exists = await fileOrDirExists(dir);

  if (!exists) await mkdir(dir);
}

await createCodeDir(CODE_DIR);

export { CONFIG_DIR, DAEMON_FILE, LANGS_FILE, CODE_DIR };
