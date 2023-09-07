import { initDaemon, stopDaemon } from "./daemon.js";
import { SuccessMessage, ErrorMessage } from "./components/messages.js";
import { render } from "ink";
import { Submit } from "./components/submit.js";
import open from "open";
import { loadProblem } from "./entities/Problem.js";

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

export { init, stop, submit, mysubs };
