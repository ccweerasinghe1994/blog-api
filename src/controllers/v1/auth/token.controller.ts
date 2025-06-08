import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
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
    const refreshToken = req.cookies.refreshToken;

    const isTokenExists = await TokenModel.exists({ token: refreshToken });

    if (!isTokenExists) {
      res.status(401).json({
        message: 'Invalid or expired refresh token',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const token = generateAccessToken(jwtPayload.userId);
    res.status(200).json({
      message: 'Access token refreshed successfully',
      status: 'success',
      code: 'Success',
      data: {
        token,
      },
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        message: 'Refresh token has expired',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        message: 'Invalid refresh token',
        status: 'error',
        code: 'AuthenticationError',
      });
      return;
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Internal server error',
      error: errorMessage,
      status: 'error',
      code: 'ServerError',
    });
  }
};

export { refreshTokenHandler };
