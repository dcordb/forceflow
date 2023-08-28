import path from "node:path";
import os from "node:os";
import { fileOrDirExists } from "./utils.js";
import { mkdir } from "node:fs/promises";

const CONFIG_DIR = path.join(os.homedir(), ".forceflow");

async function createConfigDir() {
  const exists = await fileOrDirExists(CONFIG_DIR);

  if (!exists) await mkdir(CONFIG_DIR);
}

createConfigDir();

export { CONFIG_DIR };
