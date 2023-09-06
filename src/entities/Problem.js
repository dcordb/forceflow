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

export { Problem, dumpProblem };
