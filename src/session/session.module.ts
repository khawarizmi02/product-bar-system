import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
