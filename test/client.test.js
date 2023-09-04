import "dotenv/config";
import { strict as assert } from "node:assert";
import { Codeforces } from "../src/client.js";

describe("Login", function () {
  describe("User and password", async function () {
    it("should login", async function () {
      const cf = await Codeforces.initFromAuth(
        process.env.CF_USER,
        process.env.CF_PASSWORD
      );

      const cookies = cf.cookieJar.toJSON().cookies;
      for (let value of ["X-User", "X-User-Sha1"])
        assert.ok(cookies.find((cookie) => cookie.key === value));

      assert.ok(await cf.loggedIn());
    });

    it("should fail to login", async function () {
      assert.rejects(Codeforces.initFromAuth("user", "password"), {
        name: "LoginError",
        message: "Could not login. User or password are incorrect",
      });
    });
  });
});
