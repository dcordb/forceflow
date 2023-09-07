import * as fs from "node:fs";
import path from "node:path";

class Contest {
  name;
  id;
  type;

  constructor(name, id, type) {
    this.name = name;
    this.id = id;
    this.type = type;
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
