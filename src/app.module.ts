import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [UserModule, AuthModule, TransactionModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
