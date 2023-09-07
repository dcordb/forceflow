import { useEffect, useMemo, useState } from "react";
import process from "node:process";
import path from "node:path";
import { LanguageMapper } from "../entities/Languages.js";
import { LANGS_FILE } from "../config.js";
import { Solution } from "../entities/Solution.js";
import { loadProblem, Problem } from "../entities/Problem.js";
import { SuccessMessage, ErrorMessage } from "./messages.js";
import { Codeforces } from "../client.js";
import { Text, Box } from "ink";
import TextInput from "ink-text-input";

function Login({ setClient, setSuccesfullLogin, setError, setLoginBox }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState("user");

  const checkLogin = async () => {
    let isLoggedIn = false;

    try {
      const c = await Codeforces.initFromAuth(user, password);
      setClient(c);
      isLoggedIn = await c.loggedIn();
    } catch (e) {
      setError(e.message);
      return;
    }

    if (isLoggedIn) {
      setSuccesfullLogin(true);
      setLoginBox(false);
    }
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text>Username: </Text>
        <TextInput
          value={user}
          onChange={setUser}
          onSubmit={() => {
            setFocus("password");
          }}
          focus={focus === "user"}
        />
      </Box>
      <Box>
        <Text>Password: </Text>
        <TextInput
          value={password}
          onChange={setPassword}
          mask="*"
          onSubmit={checkLogin}
          focus={focus === "password"}
        />
      </Box>
    </Box>
  );
}

function WatchSubmission({ client, solution }) {
  return <SuccessMessage msg={"Logged in!"} />;
}

function Submit({ solutionPath }) {
  const [error, setError] = useState();
  const [client, setClient] = useState(null);
  const [loginBox, setLoginBox] = useState(false);
  const [succesfullLogin, setSuccesfullLogin] = useState(false);

  const solution = useMemo(() => {
    const cwd = process.cwd();
    const problem = loadProblem(cwd);
    const mapper = new LanguageMapper();
    mapper.loads(LANGS_FILE);

    const extension = path.extname(solutionPath).slice(1);
    const language = mapper.getLangConfig(extension);
    const solution = new Solution(solutionPath, language, problem);

    return solution;
  }, []);

  useEffect(() => {
    const initClient = async () => {
      let c = null;
      let logged = false;

      try {
        c = await Codeforces.initFromCookies();
        setClient(c);
        logged = await c.loggedIn();
      } catch (err) {
        setLoginBox(true);
        return;
      }

      if (logged) setSuccesfullLogin(true);
      else setLoginBox(true);
    };

    initClient();
  }, []);

  if (error) return <ErrorMessage msg={error} />;

  if (loginBox)
    return (
      <>
        <Text>Enter your user and password to be able to submit</Text>
        <Login
          setClient={setClient}
          setSuccesfullLogin={setSuccesfullLogin}
          setError={setError}
          setLoginBox={setLoginBox}
        />
      </>
    );

  if (succesfullLogin)
    return <WatchSubmission client={client} solution={solution} />;

  return null;
}

export { Submit };
