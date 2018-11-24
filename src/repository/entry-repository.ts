import { User } from "../model/user";
import { Entry } from "../model/entry";
import { NewEntry } from "../model/new-entry";
import { EditEntry } from "../model/edit-entry";

export interface EntryRepository {
  list(user: User, offset: number, limit: number): Promise<Entry[]>;
  create(user: User, entry: NewEntry): Promise<boolean>;
  resolve(id: number): Promise<Entry>;
  update(entry: EditEntry): Promise<boolean>;
}
