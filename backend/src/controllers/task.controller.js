const path = require('path');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildFileUrl, removeFile } = require('../utils/file');

const parseDueDate = (value) => {
  if (!value) {
    throw new AppError('Due date is required', 400);
  }
  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    throw new AppError('Invalid due date format', 400);
  }
  return parsed.toDate();
};

const ensureValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid task id', 400);
  }
};

const formatTask = (task, req) => ({
  id: task._id,
  title: task.title,
  status: task.status,
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  attachmentPath: task.attachmentPath,
  attachmentUrl: buildFileUrl(req, task.attachmentPath)
});

exports.getTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalTasks = await Task.countDocuments({ owner: req.user.id });
  const tasks = await Task.find({ owner: req.user.id })
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalTasks / limit);

  res.json({
    success: true,
    data: tasks.map((task) => formatTask(task, req)),
    pagination: {
      page,
      limit,
      totalTasks,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, dueDate, status = 'todo' } = req.body;

  const payload = {
    owner: req.user.id,
    title,
    status,
    dueDate: parseDueDate(dueDate)
  };

  if (req.file) {
    payload.attachmentPath = path.posix.join('uploads', req.file.filename);
  }

  const task = await Task.create(payload);
  res.status(201).json({
    success: true,
    message: 'Task created',
    data: formatTask(task, req)
  });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidId(id);

  const task = await Task.findOne({ _id: id, owner: req.user.id });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const hasBodyUpdates = Boolean(req.body.title || req.body.status || req.body.dueDate);
  if (!hasBodyUpdates && !req.file) {
    throw new AppError('Provide at least one field to update', 400);
  }

  if (req.body.title) {
    task.title = req.body.title;
  }
  if (req.body.status) {
    task.status = req.body.status;
  }
  if (req.body.dueDate) {
    task.dueDate = parseDueDate(req.body.dueDate);
  }

  if (req.file) {
    if (task.attachmentPath) {
      await removeFile(task.attachmentPath);
    }
    task.attachmentPath = path.posix.join('uploads', req.file.filename);
  }

  await task.save();
  res.json({
    success: true,
    message: 'Task updated',
    data: formatTask(task, req)
  });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidId(id);

  const task = await Task.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.attachmentPath) {
    await removeFile(task.attachmentPath);
  }

  res.json({ success: true, message: 'Task deleted' });
});
