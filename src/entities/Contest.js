import * as fs from "node:fs";
import path from "node:path";

class Contest {
  name;
  id;

  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

function dumpContest(contestDir, contest) {
  const configFile = path.join(contestDir, ".forceflow_contest");
  fs.writeFileSync(configFile, JSON.stringify(contest, null, 4));
}

function loadContest(contestDir) {
  const file = path.join(contestDir, ".forceflow_contest");
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

export { Contest, dumpContest, loadContest };
