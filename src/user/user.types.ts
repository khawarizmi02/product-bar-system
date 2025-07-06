export type UserUpdateTokenInput = { userId: number; token: string };
export type UserUpdateResetTokenInput = { userId: number; resetToken: string };
export type UserUpdatePasswordInput = { userId: number; password: string };

export type UserUpdateMembershipStatusInput = {
  userId: number;
  isMember: boolean;
};
