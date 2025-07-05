import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AuthInput,
  AuthOutput,
  RegisterInput,
  RegisterOutput,
  ResetPasswordConfirmInput,
  ResetPasswordInput,
  SignInData,
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticate(
    input: AuthInput,
  ): Promise<AuthOutput | UnauthorizedException> {
    if (!input.email || !input.password) {
      throw new UnauthorizedException('Email and password are required');
    }
    const user = await this.userService.findUserByEmail(input.email);

    if (!user || !(await bcrypt.compare(input.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return this.signIn(user);
  }

  async signIn(user: SignInData): Promise<AuthOutput> {
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    await this.userService.updateUserToken({
      userId: user.id,
      token: accessToken,
    });

    return {
      token: accessToken,
      userId: user.id,
      name: user.username,
      email: user.email,
    };
  }

  async register(input: RegisterInput): Promise<RegisterOutput | null> {
    const newUser = await this.userService.registerUser(input);

    if (!newUser) return null;

    return {
      userId: newUser.id,
      name: newUser.username,
    };
  }

  async requestPasswordReset(input: ResetPasswordInput): Promise<String> {
    const user = await this.userService.findUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    await this.userService.updateUserToken({
      userId: user.id,
      token: resetToken,
    });

    // Here the system would typically send the reset token to the user's email
    // For demonstration purposes, we will just log it to the console
    // In a real application, the system would use a mail service to send the token
    // e.g., await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    console.log(`Password reset token for ${input.email}: ${resetToken}`);

    // consider new token to be a password reset token
    return resetToken;
  }

  async confirmPasswordReset(
    input: ResetPasswordConfirmInput,
  ): Promise<Boolean> {
    const payload = await this.jwtService.verifyAsync(input.token);
    const user = await this.userService.findUserByEmail(payload.email);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.newPassword, saltRounds);
    await this.userService.updateUserPassword({
      userId: user.id,
      password: hashedPassword,
    });
    return true;
  }
}
