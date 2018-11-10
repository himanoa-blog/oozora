import express from "express";
import * as Express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import applyRouter from "./route";

dotenv.config();

function createLogger() {
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

function csrfCustomErrorHandler(
  err: any,
  _req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  res.status(403);
  res.send("form tampered with");
}

const middlewares = [
  createLogger(),
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json(),
  cookieParser(),
  csrf({ cookie: true }),
  bodyParser.urlencoded({
    extended: true
  }),
  csrfCustomErrorHandler
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
