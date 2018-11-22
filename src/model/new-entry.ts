import * as Joi from "joi"

export interface NewEntry {
  title: string;
  body: string;
  published: boolean;
  userId: number;
}

export async function parseNewEntry(obj: {[keys in string]: any}): Promise<NewEntry> {
  const validator = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    published: Joi.boolean().required(),
    userId: Joi.number().required()
  });
  const result = await Joi.validate(obj, validator).catch(err => { throw err })
  return result as NewEntry
}
