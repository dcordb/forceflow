import "dotenv/config";
import { strict as assert } from "node:assert";
import { Codeforces } from "../src/client.js";

describe("Login", function () {
  it("should login with user and password", async function () {
    const cf = await Codeforces.initFromAuth(
      process.env.CF_USER,
      process.env.CF_PASSWORD
    );

    const cookies = cf.cookieJar.toJSON().cookies;
    for (let value of ["X-User", "X-User-Sha1"])
      assert.ok(cookies.find((cookie) => cookie.key === value));
  });
});
