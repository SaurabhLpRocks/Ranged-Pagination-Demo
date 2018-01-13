import * as Joi from 'joi';

export const createTaskModel = Joi.object().keys({
  index: Joi.number().required(),
  name: Joi.string().required(),
  userId: Joi.string().required(),
  mobile: Joi.number().required(),
  taskDate: Joi.string().required(),
});

