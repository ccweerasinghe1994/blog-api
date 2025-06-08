type TResponse<T> = {
  status: 'success' | 'error';
  code:
    | 'ServerError'
    | 'BadRequest'
    | 'Unauthorized'
    | 'NotFound'
    | 'Forbidden'
    | 'Conflict'
    | 'InternalServerError'
    | 'AuthenticationError'
    | 'Success';
  message: string;
  data?: T;
  error?: string;
};

type TUser = {
  _id: string;
  username: string;
  email: string;
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

type TToken = {
  _id: string;
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};
type TLoginResponse = {
  user: TUser;
  accessToken: string;
  message: string;
};
type TRegisterResponse = {
  user: TUser;
  message: string;
};

export type { TLoginResponse, TRegisterResponse, TResponse, TToken, TUser };
