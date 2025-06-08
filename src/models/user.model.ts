import { hash } from 'bcrypt';
import { model, Schema } from 'mongoose';

type IUser = {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    website?: string;
    x?: string;
    youtube?: string;
    linkedin?: string;
  };
};

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username must be at most 20 characters long'],
      unique: [true, 'Username must be unique'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxlength: [50, 'Email must be at most 50 characters long'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Do not return password in queries
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['user', 'admin'],
        message: '${VALUE} is not a valid role',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: [30, 'First name must be at most 30 characters long'],
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: [30, 'Last name must be at most 30 characters long'],
      trim: true,
    },
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        maxlength: [100, 'Facebook link must be at most 100 characters long'],
      },
      instagram: {
        type: String,
        trim: true,
        maxlength: [100, 'Instagram link must be at most 100 characters long'],
      },
      website: {
        type: String,
        trim: true,
        maxlength: [100, 'Website link must be at most 100 characters long'],
      },
      x: {
        type: String,
        trim: true,
        maxlength: [
          100,
          'X (formerly Twitter) link must be at most 100 characters long',
        ],
      },
      youtube: {
        type: String,
        trim: true,
        maxlength: [100, 'YouTube link must be at most 100 characters long'],
      },
      linkedin: {
        type: String,
        trim: true,
        maxlength: [100, 'LinkedIn link must be at most 100 characters long'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await hash(this.password, 10);
  next();
});

const UserModel = model('User', userSchema);
export { UserModel, type IUser };
