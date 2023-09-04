import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { LoginError } from "./errors.js";
import * as fs from "node:fs/promises";
import { CONFIG_DIR } from "./config.js";
import path from "node:path";

class OnlineJudgeClient {
  baseUrl;
  client;
}

class Codeforces extends OnlineJudgeClient {
  baseUrl = "https://codeforces.com";
  #cookieJar;
  static cookieFile = path.join(CONFIG_DIR, "cookies.json");

  constructor(cookieJar) {
    super();
    this.#cookieJar = cookieJar || new CookieJar();
    this.client = wrapper(
      axios.create({
        jar: this.#cookieJar,
        baseURL: this.baseUrl,
      })
    );
  }

  get cookieJar() {
    return this.#cookieJar;
  }

  static async #getCsrfToken(client) {
    let result = await client.get("/enter");
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

    await Codeforces.#saveCookieJar(cf.cookieJar);
    return cf;
  }

  static async #saveCookieJar(cookieJar) {
    const cookieJson = cookieJar.toJSON();
    await fs.writeFile(Codeforces.cookieFile, JSON.stringify(cookieJson));
  }

  static async initFromCookies() {
    const cookieJson = await fs.readFile(Codeforces.cookieFile, {
      encoding: "utf8",
    });

    const loadedCookieJar = CookieJar.fromJSON(JSON.parse(cookieJson));
    return new Codeforces(loadedCookieJar);
  }

  async loggedIn() {
    let result = await this.client.get("/");
    const match = result.data.match(/handle = "([\s\S]+?)"/);
    return Boolean(match);
  }
}

export { Codeforces };
