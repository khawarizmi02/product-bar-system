export type AuthInput = { email: string; password: string };
export type AuthOutput = {
  token: string;
  userId: number;
  name: string;
  email: string;
};

export type SignInData = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};
export type RegisterOutput = { userId: number; name: string };

export type ResetPasswordInput = { email: string };
export type ResetPasswordConfirmInput = { token: string; newPassword: string };
