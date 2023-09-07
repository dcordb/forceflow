import { Command } from "commander";
import * as actions from "./cmdActions.js";

const cli = new Command();

cli
  .name("forceflow")
  .description("A CLI to make Codeforces interaction better.");

cli
  .command("start")
  .description("Start Forceflow daemon.")
  .action(actions.init);
cli.command("stop").description("Stop Forceflow daemon.").action(actions.stop);

cli
  .command("submit <file>")
  .description("Submit a solution to Codeforces")
  .action(actions.submit);

cli
  .command("my")
  .description("Open my submissions in a browser")
  .action(actions.mysubs);

cli
  .command("test <file>")
  .description("Run a solution against testcases")
  .action(actions.test);

cli.parse();
