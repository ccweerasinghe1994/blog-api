import dotenv from 'dotenv';
import ms from 'ms';

dotenv.config();

type Environment = 'development' | 'production' | 'test';

type AppConfig = {
  PORT: number | string;
  NODE_ENV: Environment;
  WHITELIST_ORIGINS: string[];
  RATE_LIMIT_MAX: number;
  MONOGO_URI: string;
  LOG_LEVEL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ACCESS_TOKEN_EXPIRY: ms.StringValue;
  JWT_REFRESH_TOKEN_EXPIRY: ms.StringValue;
  WHITELIST_ADMIN_EMAIL_LIST: string[];
};

const APP_CONFIG: AppConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: (process.env.NODE_ENV as Environment) || 'development',
  WHITELIST_ORIGINS: ['https://docs.blog.api.cgnexus.com'],
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : 100,
  MONOGO_URI: process.env.MONOGO_URI || 'mongodb://localhost:27017/myapp',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  JWT_REFRESH_TOKEN_EXPIRY: process.env
    .JWT_REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_EMAIL_LIST: process.env.WHITELIST_ADMIN_EMAIL_LIST
    ? process.env.WHITELIST_ADMIN_EMAIL_LIST.split(',')
    : [],
};

export { APP_CONFIG };
