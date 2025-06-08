import { model, Schema, Types } from 'mongoose';

type IToken = {
  userId: Types.ObjectId;
  token: string;
};

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
  },
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true,
    trim: true,
    maxlength: [500, 'Token must be at most 500 characters long'],
  },
});

const TokenModel = model<IToken>('Token', tokenSchema);

export { IToken, TokenModel };
