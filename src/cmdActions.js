import { initDaemon, stopDaemon } from "./daemon.js";
import { SuccessMessage, ErrorMessage } from "./components/messages.js";
import { render } from "ink";
import { Submit } from "./components/submit.js";

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

export { init, stop, submit };
