#!/usr/bin/env node
import { Command } from "commander";
import { initDaemon, stopDaemon } from "./daemon.js";

const cli = new Command();

cli
  .name("forceflow")
  .description("A CLI to make Codeforces interaction better.");

cli
  .command("init")
  .description("Initialize Forceflow daemon.")
  .action(initDaemon);

cli.command("stop").description("Stop Forceflow daemon.").action(stopDaemon);

cli.parse();
