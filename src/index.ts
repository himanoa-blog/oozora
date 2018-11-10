import express from "express";
import * as Express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import applyRouter from "./route";

const app = express();
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
