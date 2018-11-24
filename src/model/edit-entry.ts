import * as Joi from "joi";

export interface EditEntry {
  id: number;
  title: string;
  body: string;
  published: boolean;
  userId: number;
}

export async function parseEditEntry(
  obj: { [keys in string]: any }
): Promise<EditEntry> {
  const validator = Joi.object()
    .keys({
      id: Joi.number().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      published: Joi.boolean().required(),
      userId: Joi.number().required(),
    })
    .rename("user_id", "userId")
  const result = await Joi.validate(obj, validator)
  return result as EditEntry;
}
