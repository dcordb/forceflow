import { Command } from "commander";

const cli = new Command();

cli
  .name("forceflow")
  .description("A CLI to make Codeforces interaction better.");

cli
  .command("parse <source>")
  .description("Parse a problem")
  .action((source) => {
    console.log(source);
  });

cli.parse();

