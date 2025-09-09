import Joi from 'joi';

export const UserSchema = {
    create: Joi.object({
        username: Joi.string().max(50).required(),
        email: Joi.string().email().max(100).required(),
        full_name: Joi.string().max(100).required(),
        password: Joi.string().min(6).required(),
        invite_token: Joi.string().allow('', null)
    }),
    update: Joi.object({
        username: Joi.string().max(50),
        email: Joi.string().email().max(100),
        full_name: Joi.string().max(100),
    })
};
