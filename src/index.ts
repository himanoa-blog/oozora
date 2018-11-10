import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrf({ cookie: true }))

app.get('/', (_, res) => {
  return res.send("hello")
})
app.listen(3000)
