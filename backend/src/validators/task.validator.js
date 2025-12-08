const { z } = require('zod');
const { TASK_STATUSES } = require('../constants/taskStatus');

const titleSchema = z.string().trim().min(3).max(150);
const dueDateSchema = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Invalid due date' });
const statusSchema = z.enum(TASK_STATUSES);

const createTaskSchema = z.object({
  title: titleSchema,
  dueDate: dueDateSchema,
  status: statusSchema.optional()
});

const updateTaskSchema = z.object({
  title: titleSchema.optional(),
  dueDate: dueDateSchema.optional(),
  status: statusSchema.optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
