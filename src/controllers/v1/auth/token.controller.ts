import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { Logger } from '@/lib/winston';
import { IToken, TokenModel } from '@/models/token.model';
import { TResponse } from '@/types';
import { RequestHandler, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

const refreshTokenHandler: RequestHandler = async (
  req,
  res: Response<TResponse<Pick<IToken, 'token'>>>,
) => {
  try {
    Logger.info('Token refresh attempt started', {
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      hasRefreshTokenCookie: !!req.cookies.refreshToken,
    });

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      Logger.warn('Token refresh failed - no refresh token in cookies', {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });
      res.status(401).json({
        message: 'Invalid or expired refresh token',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }
    Logger.info('Checking refresh token existence in database', {
      tokenLength: refreshToken.length,
      timestamp: new Date().toISOString(),
    });

    const isTokenExists = await TokenModel.exists({ token: refreshToken });

    if (!isTokenExists) {
      Logger.warn(
        'Token refresh failed - refresh token not found in database',
        {
          tokenLength: refreshToken?.length || 0,
          timestamp: new Date().toISOString(),
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
        },
      );
      res.status(401).json({
        message: 'Invalid or expired refresh token',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }
    Logger.info('Refresh token found in database - verifying JWT signature', {
      tokenLength: refreshToken.length,
      timestamp: new Date().toISOString(),
    });

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    Logger.info('Refresh token verified successfully', {
      userId: jwtPayload.userId,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Generating new access token', {
      userId: jwtPayload.userId,
      timestamp: new Date().toISOString(),
    });

    const token = generateAccessToken(jwtPayload.userId);

    Logger.info('New access token generated successfully', {
      userId: jwtPayload.userId,
      tokenLength: token.length,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Sending token refresh response', {
      userId: jwtPayload.userId,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
    });

    res.status(200).json({
      message: 'Access token refreshed successfully',
      status: 'success',
      code: 'Success',
      data: {
        token,
      },
    });

    Logger.info('Token refresh completed successfully', {
      userId: jwtPayload.userId,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      Logger.warn('Token refresh failed - refresh token expired', {
        error: error.message,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });
      res.status(401).json({
        message: 'Refresh token has expired',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      Logger.warn('Token refresh failed - invalid JWT signature', {
        error: error.message,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });
      res.status(401).json({
        message: 'Invalid refresh token',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    Logger.error('Token refresh error - Exception caught', {
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      hasRefreshToken: !!req.cookies.refreshToken,
    });

    res.status(500).json({
      message: 'Internal server error',
      error: errorMessage,
      status: 'error',
      code: 'ServerError',
    });
  }
};

export { refreshTokenHandler };
