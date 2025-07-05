import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';
import {
  RegisterInput,
  ResetPasswordConfirmInput,
  ResetPasswordInput,
} from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Request() request) {
    return request.user || new NotImplementedException('User not found');
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() input: RegisterInput) {
    return this.authService.register(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return new NotImplementedException(
      'Logout endpoint is not implemented yet',
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() request) {
    return request.user || new NotImplementedException('User not found');
  }

  @HttpCode(HttpStatus.OK)
  @Post('password-reset/request')
  requestPasswordReset(@Body() input: ResetPasswordInput) {
    return this.authService.requestPasswordReset(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('password-reset/confirm')
  confirmPasswordReset(@Body() input: ResetPasswordConfirmInput) {
    return this.authService.confirmPasswordReset(input);
  }
}
