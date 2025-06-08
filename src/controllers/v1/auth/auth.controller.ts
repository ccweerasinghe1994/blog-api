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

    Logger.info('User registration attempt started', {
      email: email,
      role: role,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    });

    // Check admin authorization
    if (
      role === 'admin' &&
      !APP_CONFIG.WHITELIST_ADMIN_EMAIL_LIST.includes(email)
    ) {
      Logger.warn(
        'Registration failed - unauthorized admin registration attempt',
        {
          email: email,
          role: role,
          timestamp: new Date().toISOString(),
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
        },
      );
      res.status(403).json({
        status: 'AuthorizationError',
        message: 'You are not allowed to register as an admin.',
      });
      return;
    }

    Logger.info('Admin authorization check passed', {
      email: email,
      role: role,
      isAdminRole: role === 'admin',
    });

    Logger.info('Generating username for new user', {
      email: email,
      timestamp: new Date().toISOString(),
    });

    const username = generateUserName();

    Logger.info('Username generated successfully', {
      email: email,
      username: username,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Creating user in database', {
      email: email,
      username: username,
      role: role,
      timestamp: new Date().toISOString(),
    });

    const createdUser = await UserModel.create({
      email,
      password,
      role,
      username,
    });

    Logger.info('User created successfully in database', {
      userId: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Generating authentication tokens for new user', {
      userId: createdUser._id,
      email: createdUser.email,
      timestamp: new Date().toISOString(),
    });

    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    Logger.info('Authentication tokens generated successfully', {
      userId: createdUser._id,
      email: createdUser.email,
      accessTokenLength: accessToken.length,
      refreshTokenLength: refreshToken.length,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Saving refresh token to database', {
      userId: createdUser._id,
      email: createdUser.email,
      timestamp: new Date().toISOString(),
    });

    const tokenDocumentToSave: HydratedDocument<IToken> = new TokenModel({
      userId: createdUser._id,
      token: refreshToken,
    });
    const savedToken = await tokenDocumentToSave.save();
    Logger.info('Refresh token saved successfully to database', {
      userId: createdUser._id,
      email: createdUser.email,
      tokenId: savedToken._id,
      timestamp: new Date().toISOString(),
    });

    Logger.info('Setting refresh token cookie', {
      userId: createdUser._id,
      email: createdUser.email,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      timestamp: new Date().toISOString(),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    Logger.info('Preparing registration success response', {
      userId: createdUser._id,
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
      timestamp: new Date().toISOString(),
    });
    res.status(200).json({
      user: {
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
      accessToken,
    });

    Logger.info('User registration completed successfully', {
      userId: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    Logger.error('User registration error - Exception caught', {
      error: errorMessage,
      stack: errorStack,
      email: req.body?.email || 'Unknown',
      role: req.body?.role || 'Unknown',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });

    res.status(500).json({
      status: 'ServerError',
      message: 'Internal server error',
      error: errorMessage,
    });
  }
};

export { registerUser };
