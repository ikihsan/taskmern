const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const requiredKeys = ['MONGO_URI', 'JWT_SECRET'];
const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigins,
  uploadsDir: path.join(__dirname, '..', '..', 'uploads'),
  cronTimezone: process.env.CRON_TZ || 'UTC'
};
