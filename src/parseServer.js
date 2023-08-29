import bodyParser from "body-parser";
import express from "express";
import * as fs from "node:fs";
import process from "node:process";
import { DAEMON_FILE } from "./config.js";

function fileExistSync(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {}

  return false;
}

function setupDaemonFile() {
  if (fileExistSync(DAEMON_FILE)) process.exit(0);

  fs.writeFileSync(DAEMON_FILE, JSON.stringify({ pid: process.pid }));
}

function setupServer() {
  const port = 10043;
  const app = express();

  app.use(bodyParser.json());

  app.post("/", (req, res) => {
    const data = req.body;
    console.log(data);
    res.sendStatus(200);
  });

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Listening on port ${port}`);
  });
}

function cleanupDaemonFile() {
  if (!fileExistSync(DAEMON_FILE)) return;

  try {
    fs.unlinkSync(DAEMON_FILE);
  } catch (e) {
    console.error("failed to delete daemonInfo file");
  }
}

process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("exit", cleanupDaemonFile);

setupDaemonFile();
setupServer();
