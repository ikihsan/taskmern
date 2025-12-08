const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const { startOverdueCron, markOverdueTasks } = require('./jobs/overdueCron');

const start = async () => {
  try {
    await connectDB();
    await markOverdueTasks();
    startOverdueCron();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error.message);
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection', error);
  process.exit(1);
});
