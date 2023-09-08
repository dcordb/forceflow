import { initDaemon, stopDaemon } from "./daemon.js";
import { SuccessMessage, ErrorMessage } from "./components/messages.js";
import { render } from "ink";
import { Submit } from "./components/submit.js";
import open from "open";
import { loadProblem } from "./entities/Problem.js";
import { loadSolutionFromFile } from "./utils/utils.js";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import * as diff from "diff";
import chalk from "chalk";
import { StressTesting } from "./components/stress.js";

function init() {
  let component = (
    <SuccessMessage msg={"Started daemon succesfully"}></SuccessMessage>
  );

  try {
    initDaemon();
  } catch (error) {
    component = <ErrorMessage msg={error.message}></ErrorMessage>;
  }

  render(component);
}

function stop() {
  let component = (
    <SuccessMessage msg={"Stopped daemon succesfully"}></SuccessMessage>
  );

  try {
    stopDaemon();
  } catch (error) {
    component = <ErrorMessage msg={error.message}></ErrorMessage>;
  }

  render(component);
}

async function submit(solutionPath) {
  render(<Submit solutionPath={solutionPath} />);
}

async function mysubs() {
  const cwd = process.cwd();
  const problem = loadProblem(cwd);

  if (!problem) {
    render(<ErrorMessage msg={"Not inside a problem folder"} />);
    return;
  }

  const contest = problem.contest;
  await open(`http://codeforces.com/${contest.type}/${contest.id}/my`);

  render(<SuccessMessage msg={"Opened my submissions"} />);
}

function test(solutionPath) {
  solutionPath = path.resolve(solutionPath);
  const solution = loadSolutionFromFile(solutionPath);

  const dir = path.dirname(solution.path);
  const langConfig = solution.language;
  const compiler = langConfig.compiler;
  const runner = langConfig.runner;

  const replacer = (obj) => {
    return obj
      .replace("${solutionPath}", solution.path)
      .replace(
        "${solutionPathBasename}",
        path.join(
          dir,
          path.basename(solution.path, path.extname(solution.path))
        )
      );
  };

  if (compiler) {
    const compileCmd = replacer(compiler);

    try {
      execSync(compileCmd);
    } catch (e) {
      render(<ErrorMessage msg={"An error ocurred compiling the solution"} />);
      return;
    }
  }

  const files = fs.readdirSync(dir);
  const inFiles = files.filter((f) => f.endsWith(".in"));

  for (const inFile of inFiles) {
    const outFile = inFile.replace(".in", ".out");
    const inPath = `${dir}/${inFile}`;
    const outPath = `${dir}/${outFile}`;

    const expectedOutput = fs.readFileSync(outPath, "utf-8");

    let runCmd = replacer(runner);
    let actualOutput = null;

    try {
      actualOutput = execSync(runCmd, {
        input: fs.readFileSync(inPath),
      }).toString("utf-8");
    } catch (e) {
      render(<ErrorMessage msg={"An error ocurred executing the solution"} />);
      return;
    }

    const differences = diff.diffLines(expectedOutput, actualOutput, {
      ignoreWhitespace: true,
    });

    const hasDifferences = differences.some(
      (part) => part.added || part.removed
    );

    if (!hasDifferences) {
      console.log(chalk.green(`Test case ${inFile} passed`));
    } else {
      console.log(`Test case ${inFile} failed`);

      differences.forEach((part) => {
        const color = part.added
          ? chalk.green
          : part.removed
          ? chalk.red
          : chalk.grey;
        console.log(color(part.value));
      });

      console.log();
    }
  }
}

function stressTesting(failingSolution, bruteSolution, generator) {
  render(
    <StressTesting
      failingSolution={failingSolution}
      bruteSolution={bruteSolution}
      generator={generator}
    />
  );
}

export { init, stop, submit, mysubs, test, stressTesting };
