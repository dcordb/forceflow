import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { LoginError } from "./errors.js";

class OnlineJudgeClient {
  baseUrl;
  client;
}

class Codeforces extends OnlineJudgeClient {
  baseUrl = "https://codeforces.com";
  #cookieJar;

  constructor() {
    super();
    this.#cookieJar = new CookieJar();
    this.client = wrapper(
      axios.create({
        jar: this.#cookieJar,
        baseURL: this.baseUrl,
      })
    );
  }

  static async #getCsrfToken(client) {
    let result = null;

    try {
      result = await client.get("/enter");
    } catch (err) {
      throw new LoginError("Request to Codeforces failed");
    }

    const match = result.data.match(/csrf='(.+?)'/);

    if (!match) throw new LoginError("Could not find csrf_token");

    return match[1];
  }

  static async initFromAuth(user, password) {
    const cf = new Codeforces();
    const csrf_token = await Codeforces.#getCsrfToken(cf.client);

    const result = await cf.client.post(
      "/enter",
      {
        handleOrEmail: user,
        password: password,
        csrf_token: csrf_token,
        action: "enter",
        remember: "on",
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const cookies = result.config.jar.toJSON().cookies;

    if (!cookies.find((cookie) => cookie.key === "X-User"))
      throw new LoginError("Could not login. User or password are incorrect");

    return cf;
  }

  static async initFromCookies(cookies) {}
}

export { Codeforces };
