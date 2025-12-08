const mongoose = require('mongoose');
const { TASK_STATUSES } = require('../constants/taskStatus');

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo'
    },
    dueDate: {
      type: Date,
      required: true
    },
    attachmentPath: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
