import express from "express";
import * as Express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import applyRouter from "./route";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from "fs";
import path from "path";

dotenv.config()

const app = express();
if(app.get('env') === 'production') {
  const logDirectory = path.resolve(process.env.LOG_DIR || "./log")
  if(!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory)
  const stream = fs.createWriteStream(path.resolve(logDirectory, "access.log"), { flags: 'a' });
  app.use(morgan("common", { stream: stream }));
} else {
  app.use(morgan("common"))
}

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.use(function (
  err: any,
  _req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  res.status(403)
  res.send('form tampered with')
})

applyRouter(app);

app.get('/', (_, res) => {
  return res.send("hello")
})

app.listen(3000)
