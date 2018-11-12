import * as Express from "express";
import { createHash } from "crypto";
import * as url from "url";
import { decode } from "jwt-simple";
import * as jwt from "jwt-simple";

import { createGoogleOAuthClient } from "../ext/oauth/google";
import { verifyToken } from "../service/login";
import { wrapAsync } from "./error-handler";
import { LoginRequest, parseLoginRequest } from "../model/login-request";

const router = Express.Router();

router.get("/oauth/callback", (req, res) => {
  const a = JSON.stringify({
    code: req.query.code,
    state: req.query.state
  });
  res.send(a);
});

router.get("/oauth/google", (req, res, _next) => {
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
  return res.redirect(
    303,
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
});

router.post(
  "/oauth/google",
  wrapAsync(async (req, res) => {
    try {
      const session = req.session;
      if(!session) throw new Error("session is not found");
      const loginRequestE = parseLoginRequest(req.body)
      if(loginRequestE[0]) return res.status(400).json({
        "error": "必要なデータが足りません"
      })
      if (session.state !== loginRequestE[1]) {
        return res.status(400).json({
          "error": "stateが一致しませんでした"
        });
      }
      const googleOAuth = createGoogleOAuthClient({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirectUri: process.env.GOOGLE_REDIRECT_URL || "",
        tokenUrl: process.env.GOOGLE_TOKEN_URL || "",
        certsUrl: process.env.GOOGLE_CERTS_URL || ""
      });
      const token = await verifyToken(req.body, {
        getToken: googleOAuth.getToken,
        getCerts: googleOAuth.getCert,
        decoder: (token, n, alg) =>
          decode(token, n, true, alg as jwt.TAlgorithm)
      });
      res.json(token);
    } catch (err) {
      res.json({ error: err.toString() });
    }
  })
);

export default {
  path: "/login",
  router
};
