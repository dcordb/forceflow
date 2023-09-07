import * as fs from "node:fs";
import path from "node:path";

class Problem {
  name;
  id;
  testcases;
  contest;

  constructor(name, id, testcases, contest) {
    this.name = name;
    this.id = id;
    this.testcases = testcases;
    this.contest = contest;
  }
}

function dumpProblem(problemDir, problem) {
  const configFile = path.join(problemDir, ".forceflow_problem");
  fs.writeFileSync(configFile, JSON.stringify(problem, null, 4));
}

function loadProblem(problemDir) {
  const file = path.join(problemDir, ".forceflow_problem");
  let data = null;

  try {
    data = fs.readFileSync(file, {
      encoding: "utf8",
    });
  } catch (e) {
    return null;
  }

  return JSON.parse(data);
}

export { Problem, dumpProblem, loadProblem };
