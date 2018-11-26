import * as mysql from "promise-mysql";

import { EntryRepository } from "./entry-repository";
import { User } from "../model/user";
import { Entry, parseEntry } from "../model/entry";
import { EditEntry } from "../model/edit-entry";
import { NewEntry } from "../model/new-entry";

export class EntryNotFoundException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class MySqlEntryRepository implements EntryRepository {
  constructor(private readonly conn: mysql.Pool) {}

  async list(user: User, offset: number, limit: number): Promise<Entry[]> {
    const query = "SELECT * FROM `entries` WHERE `user_id`=? LIMIT ?, ?;";
    const result = await this.conn.query(query, [user.id, limit, offset]);
    return await Promise.all(result.map(val => parseEntry(val)));
  }

  async create(user: User, entry: NewEntry): Promise<boolean> {
    const query =
      "INSERT INTO `entries` (`title`, `body`, `published`, `user_id`) VALUES (?, ?, ?, ?);";
    await this.conn.query(query, [
      entry.title,
      entry.body,
      entry.published,
      user.id
    ]);
    return true;
  }

  async resolve(id: number): Promise<Entry> {
    const query = "SELECT * FROM `entries` WHERE `id`=?";
    const result = await this.conn.query(query, id);
    return (await Promise.all(result.map(parseEntry)))[0];
  }

  async update(id: number, entry: EditEntry): Promise<boolean> {
    const query =
      "UPDATE `entries` SET `title`=?, `body`=?, `published`=? WHERE `id`=?";
    const result = await this.conn.query(query, [
      entry.title,
      entry.body,
      entry.published,
      id
    ]);
    return true;
  }
}
