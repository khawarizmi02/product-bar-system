import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  UserUpdateMembershipStatusInput,
  UserUpdatePasswordInput,
  UserUpdateTokenInput,
} from './user.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding user by email: ${error.message}`,
      );
    }
  }

  async findUserByName(username: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding user by name: ${error.message}`,
      );
    }
  }

  async updateUserToken(data: UserUpdateTokenInput): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { token: data.token },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user token: ${error.message}`,
      );
    }
  }

  async registerUser(data: Prisma.UserCreateInput): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error registering user: ${error.message}`,
      );
    }
  }

  async updateUserPassword(data: UserUpdatePasswordInput): Promise<User> {
    return this.prisma.user.update({
      where: { id: data.userId },
      data: {
        password: data.password,
      },
    });
  }

  async updateUserMembershipStatus(
    input: UserUpdateMembershipStatusInput,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id: input.userId },
        data: { isMember: input.isMember },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user membership status: ${error.message}`,
      );
    }
  }
}
