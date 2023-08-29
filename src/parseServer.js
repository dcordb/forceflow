import bodyParser from "body-parser";
import express from "express";
import * as fs from "node:fs/promises";
import { unlinkSync } from "node:fs";
import process from "node:process";
import { DAEMON_FILE } from "./config.js";

const port = 10043;
const app = express();

fs.writeFile(DAEMON_FILE, JSON.stringify({ pid: process.pid })).catch(() =>
  console.error("failed to write daemonInfo file")
);

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

function cleanup() {
  try {
    unlinkSync(DAEMON_FILE);
  } catch (e) {
    console.error("failed to delete daemonInfo file");
  }
}

process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("exit", cleanup);
