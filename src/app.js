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

cli.parse();
