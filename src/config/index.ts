import dotenv from 'dotenv';

dotenv.config();

const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: ['https://docs.blog.api.cgnexus.com'],
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : 100,
};

export { APP_CONFIG };
