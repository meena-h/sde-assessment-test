// backend/src/models/Task.js
import Joi from 'joi';

// Schema for individual checklist items
export const todoSchema = Joi.object({
  text: Joi.string().max(200).required(),
  completed: Joi.boolean().default(false)
});

// Main Task schema
export const TaskSchema = {

  create: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done').default('todo'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    due_date: Joi.date().iso().allow(null),
    assigned_to: Joi.number().integer().positive().allow(null),
    created_by: Joi.number().integer().positive().required(),
    attachments: Joi.array().items(Joi.string().uri()).default([]),
    todoChecklist: Joi.array().items(todoSchema).default([]),
    progress: Joi.number().min(0).max(100).default(0),
    created_at: Joi.date().iso().default(() => new Date(), 'time of creation'),
    updated_at: Joi.date().iso().default(() => new Date(), 'time of update')
  }),

  update: Joi.object({
    title: Joi.string().max(200),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in-progress', 'done'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    due_date: Joi.date().iso().allow(null),
    assigned_to: Joi.number().integer().positive().allow(null),
    created_by: Joi.number().integer().positive(),
    attachments: Joi.array().items(Joi.string().uri()),
    todoChecklist: Joi.array().items(todoSchema),
    progress: Joi.number().min(0).max(100),
    updated_at: Joi.date().iso().default(() => new Date(), 'time of update')
  }),

};
