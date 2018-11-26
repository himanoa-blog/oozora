import * as Express from "express";

import sqlPool from "../infra/database/mysql";
import { MySqlEntryRepository } from "../repository/mysql-entry-repository";
import { MySqlUserRepository } from "../repository/mysql-user-repository";
import { NewEntry, parseNewEntry } from "../model/new-entry";
import { EditEntry, parseEditEntry } from "../model/edit-entry";
import { Entry, parseEntry } from "../model/entry";
import { createEntry, updateEntry } from "../service/EntryService"
import { wrapAsync } from "./error-handler";

const router = Express.Router();

router.use((req, res, next) => {
  console.dir(req.headers.authorization);
  if (req.method !== "OPTIONS" && !req.headers.authorization) {
    res.status(403).json({ error: "No credential sent." });
  } else {
    next();
  }
});

router.post(
  "/",
  wrapAsync(async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const [_, token = ""] = authHeader.split(" ");
    const user = await new MySqlUserRepository(sqlPool).fromToken(token);
    const validEntry = await parseNewEntry({
      ...req.body,
      ...{ userId: user.id }
    });

    await new MySqlEntryRepository(sqlPool).create(user, validEntry);
    return res.sendStatus(201);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const [_, token = ""] = authHeader.split(" ");

    const limit = parseInt(req.params.limit, 10) || 100;
    const offset = parseInt(req.params.offset, 10) || 0;

    const user = await new MySqlUserRepository(sqlPool).fromToken(token);
    const entries = await new MySqlEntryRepository(sqlPool).list(
      user,
      limit,
      offset
    );

    return res.status(200).json(entries);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const [_, token = ""] = authHeader.split(" ");
    const user = await new MySqlUserRepository(sqlPool).fromToken(token);

    const entry = await new MySqlEntryRepository(sqlPool).resolve(
      parseInt(req.params.id, 10)
    );

    res.status(200).json(entry);
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const authHeader = req.headers.authorization || "";
    const [_, token = ""] = authHeader.split(" ");
    const userRepository = new MySqlUserRepository(sqlPool)
    const user = await userRepository.fromToken(token);
    const entry = await parseEditEntry(req.body)
    
    await updateEntry(parseInt(req.params.id, 10), user.id, entry, {
      entryRepository: new MySqlEntryRepository(sqlPool),
      userRepository
    })

    res.sendStatus(204);
  })
)

export default {
  path: "/entries",
  router
};
