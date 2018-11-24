import { EntryRepository } from "../repository/entry-repository";
import { UserRepository } from "../repository/user-repository";
import { User } from "../model/user";
import { Entry } from "../model/entry";
import { EditEntry } from "../model/edit-entry";
import { NewEntry } from "../model/new-entry";

export class EditForbiddenError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export interface CreateEntryDep {
  entryRepository: EntryRepository
}

export async function createEntry(user: User, newEntry: NewEntry, dep: CreateEntryDep) {
  await dep.entryRepository.create(user, newEntry)
}

export interface UpdateEntryDep {
  entryRepository: EntryRepository;
  userRepository: UserRepository;
}

export async function updateEntry(editEntry: EditEntry, dep: UpdateEntryDep): Promise<boolean>{
  const entry = await dep.entryRepository.resolve(editEntry.id)
  if(entry.userId !== editEntry.userId) {
    throw new EditForbiddenError(`${editEntry.userId} is not ${entry.userId}`)
  }
  return await dep.entryRepository.update(editEntry);
}
