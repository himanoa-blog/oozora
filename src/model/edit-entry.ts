import * as Joi from "joi";

export interface EditEntry {
  title: string;
  body: string;
  published: boolean;
}

export async function parseEditEntry(
  obj: { [keys in string]: any }
): Promise<EditEntry> {
  const validator = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    published: Joi.boolean().required()
  });
  const result = await Joi.validate(obj, validator);
  return result as EditEntry;
}
