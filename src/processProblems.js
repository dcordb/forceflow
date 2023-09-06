import * as fs from "node:fs";
import path from "node:path";
import { CODE_DIR } from "./config.js";
import { Contest, dumpContest } from "./entities/Contest.js";
import { Problem, dumpProblem } from "./entities/Problem.js";
import { Testcase } from "./entities/Testcase.js";

function extractIdsFromUrl(url) {
  const regex =
    /https:\/\/codeforces\.com\/(contest|gym)\/(\d+)\/problem\/([A-Za-z]+)/;
  const match = url.match(regex);

  if (match) {
    const contestId = match[2];
    const problemId = match[3];

    return {
      contestId,
      problemId,
    };
  } else {
    return null;
  }
}

function processProblem(problemData) {
  const result = extractIdsFromUrl(problemData.url);

  if (!result) return;

  const { contestId, problemId } = result;
  const contest = new Contest(problemData.group, contestId);

  const testcases = problemData.tests.map(
    (test, id) => new Testcase(id + 1, test.input, test.output)
  );

  const problem = new Problem(problemData.name, problemId, testcases, contest);

  const contestPath = path.join(CODE_DIR, contestId);

  try {
    fs.mkdirSync(contestPath);
  } catch (e) {}

  dumpContest(contestPath, contest);

  const problemPath = path.join(contestPath, problemId);

  try {
    fs.mkdirSync(problemPath);
  } catch (e) {
    return;
  }

  dumpProblem(problemPath, problem);

  for (const test of testcases) {
    const inputTestName = path.join(problemPath, `${test.id}.in`);
    const outputTestName = path.join(problemPath, `${test.id}.out`);
    fs.writeFileSync(inputTestName, test.input);
    fs.writeFileSync(outputTestName, test.output);
  }

  console.log("saved problem data successfully");
}

export { processProblem };
