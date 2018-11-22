import * as Joi from "joi"

export interface Entry {
  id: number;
  title: string;
  body: string;
  published: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export async function parseEntry(obj: {[keys in string]: any}): Promise<Entry> {
  const validator = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    published: Joi.boolean().required(),
    user_id: Joi.number().required(),
    updated_at: Joi.date().required(),
    created_at: Joi.date().required(),
  }).rename('user_id', 'userId').rename('updated_at', 'updatedAt').rename('created_at', 'createdAt');
  const result = await Joi.validate(obj, validator).catch(err => { throw err })
  return result as Entry
}
