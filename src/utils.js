import { access } from "node:fs/promises";

async function fileOrDirExists(path) {
  try {
    await access(path);
  } catch (e) {
    return false;
  }

  return true;
}

export { fileOrDirExists };
