#!/usr/bin/env node
import { Command } from "commander";

const cli = new Command();

cli
  .name("forceflow")
  .description("A CLI to make Codeforces interaction better.");

cli
  .command("parse <url>")
  .description("Parse a problem")
  .action((link) => {
    console.log(link);
  });

cli.parse();
