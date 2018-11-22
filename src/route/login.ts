import * as Express from "express";
import { createHash } from "crypto";
import * as url from "url";
import { decode } from "jwt-simple";
import * as jwt from "jwt-simple";
import uuid from "uuid/v4";
import * as ExpressSession from "express-session";

import { createGoogleOAuthClient } from "../ext/oauth/google";
import { verifyToken, login } from "../service/login";
import { wrapAsync } from "./error-handler";
import { LoginRequest, parseLoginRequest } from "../model/login-request";
import { MySqlUserRepository } from "../repository/mysql-user-repository";
import { MemcachedOAuthStateRepository } from "../repository/memcached-oauth-state-repository";
import sqlPool from "../infra/database/mysql";
import memcachedConn from "../infra/database/memcached";

const router = Express.Router();

router.get("/oauth/setup", (req, res) => {
  res.sendStatus(200);
});

router.get("/oauth/google", async (req, res, _next) => {
  const salt = "a";
  const state = createHash("sha256")
    .update(`${salt}${Math.random()}${+new Date()}`)
    .digest("hex");
  const params = new url.URLSearchParams({
    response_type: "code",
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    scope: "profile",
    state
  });
  req!.session!.state = state;
  await new MemcachedOAuthStateRepository(memcachedConn).write(state);
  return res.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  });
});

router.post(
  "/oauth/google",
  wrapAsync(async (req, res) => {
    try {
      const session = req.session!;
      if (!session) throw new Error("session is not found");
      const loginRequestE = parseLoginRequest(req.body);
      const oauthRepository = new MemcachedOAuthStateRepository(memcachedConn);
      if (loginRequestE[0])
        return res.status(400).json({
          error: "必要なデータが足りません"
        });
      if (!(await oauthRepository.exists(loginRequestE[1]!.state))) {
        return res.status(400).json({
          error: "stateが一致しませんでした"
        });
      }
      const googleOAuth = createGoogleOAuthClient({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirectUri: process.env.GOOGLE_REDIRECT_URL || "",
        tokenUrl: process.env.GOOGLE_TOKEN_URL || "",
        certsUrl: process.env.GOOGLE_CERTS_URL || ""
      });
      const currentUser = await login(loginRequestE[1] as LoginRequest, {
        verifyTokenDep: {
          getToken: googleOAuth.getToken,
          getCerts: googleOAuth.getCert,
          decoder: (token: string, n: string, alg: any) =>
            decode(token, n, true, alg as jwt.TAlgorithm)
        },
        generateToken: uuid,
        userRepository: new MySqlUserRepository(sqlPool)
      });
      res.json(currentUser);
    } catch (err) {
      res.status(400).json({ error: err.toString() });
    }
  })
);

export default {
  path: "/login",
  router
};
