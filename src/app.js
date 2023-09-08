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

cli
  .command("stress <failingSolution> <bruteSolution> <generator>")
  .description(
    "Stress test the <failingSolution> with the <bruteSolution> using a generator. Uses already compiled executables for each one."
  )
  .action(actions.stressTesting);

cli.parse();
