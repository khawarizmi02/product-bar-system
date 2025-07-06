import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [TransactionService, PrismaService, AuthService],
  controllers: [TransactionController],
  imports: [UserModule],
  exports: [TransactionService],
})
export class TransactionModule {}
