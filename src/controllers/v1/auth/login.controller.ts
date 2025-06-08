import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { Logger } from '@/lib/winston';
import { IToken, TokenModel } from '@/models/token.model';
import { UserModel } from '@/models/user.model';
import { RequestHandler } from 'express';
import { HydratedDocument } from 'mongoose';
const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email })
      .select('email password role username')
      .lean()
      .exec();
    if (!user) {
      res.status(401).json({ message: 'Email or password is incorrect' });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const tokenDocumentToSave: HydratedDocument<IToken> = new TokenModel({
      userId: user._id,
      token: refreshToken,
    });

    const savedToken = await tokenDocumentToSave.save();
    Logger.info('Refresh token saved successfully', {
      userId: user._id,
      tokenId: savedToken._id,
      token: savedToken.token,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Perform login logic here

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
    Logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    Logger.error('Login error', {
      error: errorMessage,
    });
    res
      .status(500)
      .json({ message: 'Internal server error', error: errorMessage });
    next(error);
  }
};

export { loginHandler };
