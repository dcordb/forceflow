import * as fs from "node:fs";
import path from "node:path";
import { CODE_DIR } from "./config.js";
import { Contest, dumpContest } from "./entities/Contest.js";
import { Problem, dumpProblem } from "./entities/Problem.js";
import { Testcase } from "./entities/Testcase.js";
import { daemonLogger as logger } from "./logger.js";

function extractIdsFromUrl(url) {
  const regex =
    /https:\/\/codeforces\.com\/(contest|gym)\/(\d+)\/problem\/([A-Za-z]+)/;
  const match = url.match(regex);

  if (match) {
    const contestType = match[1];
    const contestId = match[2];
    const problemId = match[3];

    return {
      contestType,
      contestId,
      problemId,
    };
  } else {
    return null;
  }
}

function processProblem(problemData) {
  logger.info(`Parsing problem ${problemData.name}`);
  const result = extractIdsFromUrl(problemData.url);

  if (!result) return;

  const { contestType, contestId, problemId } = result;
  const contest = new Contest(problemData.group, contestId, contestType);

  const testcases = problemData.tests.map(
    (test, id) => new Testcase(id + 1, test.input, test.output)
  );

  const problem = new Problem(problemData.name, problemId, testcases, contest);
  logger.debug(problem);

  const contestPath = path.join(CODE_DIR, contestId);

  try {
    fs.mkdirSync(contestPath);
  } catch (e) {}

  dumpContest(contestPath, contest);

  logger.info("Saved contest info");

  const problemPath = path.join(contestPath, problemId);

  try {
    fs.mkdirSync(problemPath);
  } catch (e) {
    return;
  }

  dumpProblem(problemPath, problem);
  logger.info("Saved problem info");

  for (const test of testcases) {
    const inputTestName = path.join(problemPath, `${test.id}.in`);
    const outputTestName = path.join(problemPath, `${test.id}.out`);
    fs.writeFileSync(inputTestName, test.input);
    fs.writeFileSync(outputTestName, test.output);
  }

  logger.info("Saved problem data successfully");
}

export { processProblem };
