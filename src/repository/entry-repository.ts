import { LoginUser } from "../model/login-user"
import { Entry } from "../model/entry"
import { NewEntry } from "../model/new-entry"

export interface EntryRepository {
  list(user: LoginUser, offset: number, limit: number): Promise<Entry[]>
  create(user: LoginUser, entry: NewEntry): Promise<boolean>
  resolve(id: number): Promise<Entry>
  update(entry: Entry): Promise<boolean>
}
