const cron = require('node-cron');
const dayjs = require('dayjs');
const Task = require('../models/Task');
const config = require('../config/env');

const markOverdueTasks = async () => {
  const now = dayjs().startOf('day').toDate();
  const result = await Task.updateMany(
    {
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    },
    { status: 'overdue' }
  );
  return result.modifiedCount || 0;
};

const startOverdueCron = () =>
  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        const count = await markOverdueTasks();
        console.log(`[CRON] Overdue job executed - ${count} tasks updated`);
      } catch (error) {
        console.error('[CRON] Failed to mark overdue tasks', error.message);
      }
    },
    { timezone: config.cronTimezone }
  );

module.exports = {
  startOverdueCron,
  markOverdueTasks
};
