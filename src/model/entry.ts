import * as Joi from "joi";

export interface Entry {
  id: number;
  title: string;
  body: string;
  published: boolean;
  updatedAt: Date;
  createdAt: Date;
  userId: number;
}

export async function parseEntry(
  obj: { [keys in string]: any }
): Promise<Entry> {
  const validator = Joi.object()
    .keys({
      id: Joi.number().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      published: Joi.boolean().required(),
      userId: Joi.number().required(),
      updatedAt: Joi.date().required(),
      createdAt: Joi.date().required()
    })
    .rename("user_id", "userId")
    .rename("updated_at", "updatedAt")
    .rename("created_at", "createdAt");
  const result = await Joi.validate(obj, validator).catch(err => {
    throw err;
  });
  return result as Entry;
}
