import * as Express from "express";

import sqlPool from "../infra/database/mysql";
import { MySqlEntryRepository } from "../repository/mysql-entry-repository"
import { MySqlUserRepository } from "../repository/mysql-user-repository"
import { NewEntry, parseNewEntry } from "../model/new-entry"
import { wrapAsync } from "./error-handler";

const router = Express.Router();

router.use((req, res, next) => {
  if(req.method !== "OPTIONS" && !req.headers.authorization) {
    res.status(403).json({error: "No credential sent."})
  } else {
    next()
  }
})

router.post("/", wrapAsync(async (req, res) => {
  const authHeader = req.headers.authorization || ""
  const [_, token=""] = authHeader.split(' ')
  const user = await new MySqlUserRepository(sqlPool).fromToken(token)
  const validEntry = await parseNewEntry({...req.body, ...{userId: user.id}})

  await new MySqlEntryRepository(sqlPool).create(user, validEntry)
  return res.sendStatus(201)
}))

router.get("/:id", wrapAsync(async (req, res) => {
  const authHeader = req.headers.authorization || ""
  const [_, token=""] = authHeader.split(' ')
  const user = await new MySqlUserRepository(sqlPool).fromToken(token)
  
  const entry = await new MySqlEntryRepository(sqlPool).resolve(parseInt(req.params.id, 10))
  return res.status(200).json(entry)
}))

export default {
  path: "/entries",
  router
}
