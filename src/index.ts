import express from "express";
import * as Express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import applyRouter from "./route";

dotenv.config();

export function createLogger() {
  if (process.env.NODE_ENV === "production") {
    const logDirectory = path.resolve(process.env.LOG_DIR || "./log");
    if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);
    const stream = fs.createWriteStream(
      path.resolve(logDirectory, "access.log"),
      { flags: "a" }
    );
    return morgan("common", { stream: stream });
  } else {
    return morgan("common");
  }
}

export function enhanceToken(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  res.header("token", req.csrfToken());
  next();
}

const middlewares = [
  createLogger(),
  bodyParser.json(),
  cookieParser(),
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 1000 * 60 * 30
    }
  }),
  csrf({cookie: false}),
  enhanceToken
];

const app = applyRouter(
  middlewares.reduce(
    (app: Express.Application, middleware) => app.use(middleware),
    express()
  )
);

app.get("/", (_, res) => {
  return res.send("hello");
});

app.listen(3000);
