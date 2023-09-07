import { Solution } from "../entities/Solution.js";
import { loadProblem } from "../entities/Problem.js";
import { LanguageMapper } from "../entities/Languages.js";
import { LANGS_FILE } from "../config.js";
import process from "node:process";
import path from "node:path";

function loadSolutionFromFile(solutionPath) {
  const cwd = process.cwd();
  const problem = loadProblem(cwd);
  const mapper = new LanguageMapper();
  mapper.loads(LANGS_FILE);

  const extension = path.extname(solutionPath).slice(1);
  const language = mapper.getLangConfig(extension);
  const solution = new Solution(solutionPath, language, problem);
  return solution;
}

export { loadSolutionFromFile };
