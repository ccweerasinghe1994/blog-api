import { APP_CONFIG } from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { Logger } from '@/lib/winston';
import { IToken, TokenModel } from '@/models/token.model';
import { IUser, UserModel } from '@/models/user.model';
import { generateUserName } from '@/utils';
import { RequestHandler } from 'express';
import { HydratedDocument } from 'mongoose';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, role } = req.body as UserData;

    if (
      role === 'admin' &&
      !APP_CONFIG.WHITELIST_ADMIN_EMAIL_LIST.includes(email)
    ) {
      res.status(403).json({
        status: 'AuthorizationError',
        message: 'You are not allowed to register as an admin.',
      });
      Logger.warn('Unauthorized admin registration attempt', {
        email,
        role,
      });
      return;
    }

    const username = generateUserName();

    const createdUser = await UserModel.create({
      email,
      password,
      role,
      username,
    });

    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    const tokenDocumentToSave: HydratedDocument<IToken> = new TokenModel({
      userId: createdUser._id,
      token: refreshToken,
    });

    const savedToken = await tokenDocumentToSave.save();
    Logger.info('Refresh token saved successfully', {
      userId: createdUser._id,
      tokenId: savedToken._id,
      token: savedToken.token,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      user: {
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
      accessToken,
    });
    Logger.info('User registered successfully', {
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      status: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    Logger.error('Error in register handler:', {
      error,
    });
  }
};

export { registerUser };
