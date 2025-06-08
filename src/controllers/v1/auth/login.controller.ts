import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { Logger } from '@/lib/winston';
import { IToken, TokenModel } from '@/models/token.model';
import { UserModel } from '@/models/user.model';
import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { HydratedDocument } from 'mongoose';
const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    Logger.info('Login attempt started', {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    });

    const user = await UserModel.findOne({ email })
      .select('email password role username')
      .lean()
      .exec();

    if (!user) {
      Logger.warn('Login failed - user not found', {
        email: email,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
      });
      res.status(401).json({ message: 'Email or password is incorrect' });
      return;
    }

    Logger.info('User found in database', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Verify password
    Logger.info('Starting password verification', {
      userId: user._id,
      email: user.email,
    });

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      Logger.warn('Login failed - invalid password', {
        userId: user._id,
        email: user.email,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
      });
      res.status(401).json({ message: 'Email or password is incorrect' });
      return;
    }

    Logger.info('Password verification successful', {
      userId: user._id,
      email: user.email,
    });

    // Generate tokens
    Logger.info('Generating authentication tokens', {
      userId: user._id,
      email: user.email,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    Logger.info('Tokens generated successfully', {
      userId: user._id,
      email: user.email,
      accessTokenLength: accessToken.length,
      refreshTokenLength: refreshToken.length,
    });

    // Save refresh token to database
    Logger.info('Saving refresh token to database', {
      userId: user._id,
      email: user.email,
    });
    const tokenDocumentToSave: HydratedDocument<IToken> = new TokenModel({
      userId: user._id,
      token: refreshToken,
    });

    const savedToken = await tokenDocumentToSave.save();
    Logger.info('Refresh token saved successfully', {
      userId: user._id,
      email: user.email,
      tokenId: savedToken._id,
    });

    // Set secure HTTP-only cookie
    Logger.info('Setting refresh token cookie', {
      userId: user._id,
      email: user.email,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Perform login logic here

    // Send successful response
    Logger.info('Preparing login response', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      accessToken,
      message: 'Login successful',
    });

    Logger.info('User logged in successfully - Login complete', {
      userId: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    Logger.error('Login error - Exception caught', {
      error: errorMessage,
      stack: errorStack,
      email: req.body?.email || 'Unknown',
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });

    res
      .status(500)
      .json({ message: 'Internal server error', error: errorMessage });
    next(error);
  }
};

export { loginHandler };
