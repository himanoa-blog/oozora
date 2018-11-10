import express from "express";

const app = express()

app.get('/', (_, res) => {
  return res.send("hello")
})
app.listen(3000)
