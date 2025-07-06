import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('session')
export class SessionController {
  @HttpCode(HttpStatus.OK)
  @Post('check-in')
  CheckIn() {
    return 'Check In';
  }
  @HttpCode(HttpStatus.OK)
  @Post('check-out')
  CheckOut() {
    return 'Check Out';
  }
}
