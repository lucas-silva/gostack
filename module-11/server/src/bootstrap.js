const dotenv = require('dotenv');

const env = process.env.NODE_ENV.trim();
const path = env === 'test' ? '.env.test' : '.env';
dotenv.config({ path });
