import { APP_CONFIG } from '@/config';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateAccessToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, APP_CONFIG.JWT_ACCESS_SECRET, {
    expiresIn: APP_CONFIG.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

const generateRefreshToken = (userId: Types.ObjectId) => {
  return jwt.sign({ userId }, APP_CONFIG.JWT_REFRESH_SECRET, {
    expiresIn: APP_CONFIG.JWT_REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, APP_CONFIG.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, APP_CONFIG.JWT_REFRESH_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
