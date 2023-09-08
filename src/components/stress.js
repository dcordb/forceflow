import { useEffect, useState } from "react";
import { Text } from "ink";
import * as diff from "diff";
import { ErrorMessage } from "./messages.js";
import { execSync } from "node:child_process";

function StressTesting({ failingSolution, bruteSolution, generator }) {
  const [testId, setTestId] = useState(1);
  const [differences, setDifferences] = useState(false);
  const [diffInput, setDiffInput] = useState();
  const [diffBruteOutput, setDiffBruteOutput] = useState();
  const [diffFailingOutput, setDiffFailingOutput] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let generatedInput = null;
    let failingOutput = null;
    let bruteOutput = null;

    try {
      generatedInput = execSync(generator).toString("utf-8");

      failingOutput = execSync(failingSolution, {
        input: generatedInput,
      }).toString("utf-8");

      bruteOutput = execSync(bruteSolution, {
        input: generatedInput,
      }).toString("utf-8");
    } catch (e) {
      setError(e.message);
      return;
    }

    const differences = diff.diffLines(bruteOutput, failingOutput, {
      ignoreWhitespace: true,
    });

    const hasDifferences = differences.some(
      (part) => part.added || part.removed
    );

    if (hasDifferences) {
      setDifferences(true);
      setDiffInput(generatedInput);
      setDiffBruteOutput(bruteOutput);
      setDiffFailingOutput(failingOutput);
      return;
    }

    setTimeout(() => {
      setTestId(testId + 1);
    }, 0);
  }, [testId]);

  if (error) {
    return <ErrorMessage msg={error} />;
  }

  if (differences) {
    return (
      <>
        <Text>Found differing outputs</Text>
        <Text color="yellow">Generated Input:</Text>
        <Text>{diffInput}</Text>
        <Text color="green">Brute Solution Output:</Text>
        <Text>{diffBruteOutput}</Text>
        <Text color="red">Failing Solution Output</Text>
        <Text>{diffFailingOutput}</Text>
      </>
    );
  }

  return <Text>Running testcase #{testId}</Text>;
}

export { StressTesting };
